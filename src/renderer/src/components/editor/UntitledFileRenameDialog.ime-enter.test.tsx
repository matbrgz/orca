// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { UntitledFileRenameDialog } from './UntitledFileRenameDialog'

afterEach(cleanup)

describe('UntitledFileRenameDialog Enter', () => {
  it('ignores the Enter that confirms an IME composition in both fields', () => {
    const onConfirm = vi.fn()
    render(
      <UntitledFileRenameDialog
        open
        currentName="Untitled-1.md"
        worktreePath="/repo"
        onClose={() => {}}
        onConfirm={onConfirm}
      />
    )
    const nameInput = screen.getByPlaceholderText('file name')
    const folderInput = screen.getByDisplayValue('/repo')

    fireEvent.keyDown(nameInput, { key: 'Enter', isComposing: true })
    fireEvent.keyDown(folderInput, { key: 'Enter', isComposing: true })
    expect(onConfirm).not.toHaveBeenCalled()

    fireEvent.keyDown(nameInput, { key: 'Enter' })
    expect(onConfirm).toHaveBeenCalledWith('Untitled-1.md')
  })
})
