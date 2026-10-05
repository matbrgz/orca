// @vitest-environment happy-dom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireImeConfirmEnter, firePlainEnter } from '@/lib/ime-enter-confirm-test-fixture'
import { OpenInMenuSetting } from './OpenInMenuSetting'

afterEach(cleanup)

/** Asserts the IME-confirm Enter keeps focus in the field while a plain Enter commits and blurs it. */
function expectEnterRespectsComposition(input: HTMLElement): void {
  act(() => input.focus())
  fireImeConfirmEnter(input)
  expect(document.activeElement).toBe(input)

  firePlainEnter(input)
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
