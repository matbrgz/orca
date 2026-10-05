// @vitest-environment happy-dom

import React, { Suspense } from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useWorkspaceKanbanColumnResize } from './use-workspace-kanban-column-resize'

// A Suspense unwind discards the render without replaying it; StrictMode cannot show this.
const settledWidths = new Set<number>()
let releasePending: (() => void) | null = null

function SuspendOnNewWidth({ width }: { width: number }): null {
  if (!settledWidths.has(width)) {
    throw new Promise<void>((resolve) => {
      releasePending = () => {
        settledWidths.add(width)
        resolve()
      }
    })
  }
  return null
}

function ColumnProbe({ committedWidth }: { committedWidth: number }): React.JSX.Element {
  const { columnWidth } = useWorkspaceKanbanColumnResize(committedWidth, () => {})
  return (
    <>
      <span data-testid="width">{columnWidth}</span>
      <SuspendOnNewWidth width={committedWidth} />
    </>
  )
}

function boundary(committedWidth: number): React.JSX.Element {
  return (
    <Suspense fallback={<span data-testid="fallback">loading</span>}>
      <ColumnProbe committedWidth={committedWidth} />
    </Suspense>
  )
}

beforeEach(() => {
  settledWidths.clear()
  settledWidths.add(320)
  releasePending = null
})

afterEach(cleanup)

describe('useWorkspaceKanbanColumnResize external width', () => {
  it('adopts a committed width even when the adopting render is discarded', async () => {
    const { rerender } = render(boundary(320))
    expect(screen.getByTestId('width').textContent).toBe('320')

    rerender(boundary(420))
    expect(screen.getByTestId('fallback')).toBeTruthy()

    await act(async () => {
      releasePending?.()
      await Promise.resolve()
    })

    expect(screen.getByTestId('width').textContent).toBe('420')
  })
})
