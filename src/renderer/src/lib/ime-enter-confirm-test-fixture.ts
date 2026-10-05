import { fireEvent } from '@testing-library/react'

/** Fires a CJK candidate confirm: the marked Enter, then the unmarked Enter/13 redispatch. */
export function fireImeConfirmEnter(input: HTMLElement): void {
  fireEvent.compositionStart(input)
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 229, isComposing: true })
  fireEvent.compositionEnd(input)
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })
}

export function firePlainEnter(input: HTMLElement): void {
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })
}
