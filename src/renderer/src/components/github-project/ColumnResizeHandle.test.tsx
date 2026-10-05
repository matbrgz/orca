// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ColumnResizeHandle from './ColumnResizeHandle'

vi.mock('@/i18n/i18n', () => ({
  translate: (_key: string, fallback: string) => fallback
}))

afterEach(cleanup)

function renderHandle(): { onResize: ReturnType<typeof vi.fn>; handle: HTMLElement } {
  const onResize = vi.fn()
  render(
    <ColumnResizeHandle
      fieldId="title"
      nextFieldId="status"
      currentWidth={2}
      nextWidth={2}
      onResize={onResize}
    />
  )
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
    const [field, width, nextField, nextWidth] = onResize.mock.calls[0] as [
      string,
      number,
      string,
      number
    ]
    expect([field, nextField]).toEqual(['title', 'status'])
    expect(width).toBeCloseTo(expected, 6)
    expect(width + nextWidth).toBeCloseTo(4, 6)
  })

  it('ignores keys that are not a resize gesture', () => {
    const { onResize, handle } = renderHandle()

    fireEvent.keyDown(handle, { key: 'Enter' })

    expect(onResize).not.toHaveBeenCalled()
  })
})
