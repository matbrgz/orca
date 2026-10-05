// @vitest-environment happy-dom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OpenInMenuSetting } from './OpenInMenuSetting'

afterEach(cleanup)

function expectEnterRespectsComposition(input: HTMLElement): void {
  act(() => input.focus())
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
  expect(document.activeElement).toBe(input)

  fireEvent.keyDown(input, { key: 'Enter' })
  expect(document.activeElement).not.toBe(input)
}

describe('OpenInMenuSetting Enter', () => {
  it('keeps editing through the Enter that confirms an IME composition', () => {
    render(
      <OpenInMenuSetting
        applications={[{ id: 'app-1', label: 'My editor', command: 'myedit' }]}
        updateSettings={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Edit app' }))

    expectEnterRespectsComposition(screen.getByPlaceholderText('App name'))
    expectEnterRespectsComposition(screen.getByDisplayValue('myedit'))
  })
})
