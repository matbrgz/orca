// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ColumnResizeHandle from './ColumnResizeHandle'

vi.mock('@/i18n/i18n', () => ({
  translate: (_key: string, fallback: string) => fallback
}))

afterEach(cleanup)

function stagePixelWidth(element: Element | null, px: number | undefined): void {
  if (element && px !== undefined) {
    Object.defineProperty(element, 'offsetWidth', { configurable: true, value: px })
  }
}

type OnResize = (field: string, width: number, nextField: string, nextWidth: number) => void

function renderHandle(
  widths: { current: number; next: number; currentPx?: number; nextPx?: number } = {
    current: 2,
    next: 2
  }
): { onResize: ReturnType<typeof vi.fn<OnResize>>; handle: HTMLElement } {
  const onResize = vi.fn<OnResize>()
  const { container } = render(
    <div>
      <div data-testid="cell">
        <ColumnResizeHandle
          fieldId="title"
          nextFieldId="status"
          currentWidth={widths.current}
          nextWidth={widths.next}
          onResize={onResize}
        />
      </div>
      <div data-testid="next-cell" />
    </div>
  )
  // happy-dom lays nothing out, so stage the rendered pixel widths the handle measures.
  stagePixelWidth(container.querySelector('[data-testid="cell"]'), widths.currentPx)
  stagePixelWidth(container.querySelector('[data-testid="next-cell"]'), widths.nextPx)
  return { onResize, handle: screen.getByRole('separator', { name: 'Resize column' }) }
}

describe('ColumnResizeHandle keyboard resizing', () => {
  it('is reachable by keyboard focus', () => {
    const { handle } = renderHandle()

    expect(handle.tabIndex).toBe(0)
  })

  it('reports the split between the column pair', () => {
    const { handle } = renderHandle()

    expect(handle.getAttribute('aria-valuenow')).toBe('50')
  })

  it.each([
    ['ArrowRight', 2.2],
    ['ArrowLeft', 1.8]
  ])('resizes the column pair on %s with the pair total held constant', (key, expected) => {
    const { onResize, handle } = renderHandle()

    fireEvent.keyDown(handle, { key })

    expect(onResize).toHaveBeenCalledTimes(1)
    const [field, width, nextField, nextWidth] = onResize.mock.calls[0]
    expect([field, nextField]).toEqual(['title', 'status'])
    expect(width).toBeCloseTo(expected, 6)
    expect(width + nextWidth).toBeCloseTo(4, 6)
  })

  it('floors the shrinking column at the measured pixel minimum', () => {
    // 1px per fr: the 60px floor is 60fr, so a 10fr step from 65 stops at 60.
    const { onResize, handle } = renderHandle({
      current: 65,
      next: 135,
      currentPx: 65,
      nextPx: 135
    })

    fireEvent.keyDown(handle, { key: 'ArrowLeft' })

    expect(onResize).toHaveBeenCalledWith('title', 60, 'status', 140)
  })

  it('ignores keys that are not a resize gesture', () => {
    const { onResize, handle } = renderHandle()

    fireEvent.keyDown(handle, { key: 'Enter' })

    expect(onResize).not.toHaveBeenCalled()
  })
})
