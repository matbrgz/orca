// @vitest-environment happy-dom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireImeConfirmEnter, firePlainEnter } from '@/lib/ime-enter-confirm-test-fixture'

const updateSettings = vi.hoisted(() => vi.fn(async () => {}))

vi.mock('@/store', () => ({
  useAppStore: (selector: (state: unknown) => unknown) =>
    selector({ settings: { hostSettingOverrides: {} }, updateSettings })
}))

import { HostRenameDialog } from './HostRenameDialog'

afterEach(() => {
  cleanup()
  updateSettings.mockClear()
})

describe('HostRenameDialog Enter', () => {
  it('ignores the Enter that confirms an IME composition and submits on a plain Enter', () => {
    const onOpenChange = vi.fn()
    render(
      <HostRenameDialog open onOpenChange={onOpenChange} hostId="local" derivedLabel="This Mac" />
    )
    const input = screen.getByPlaceholderText('This Mac')

    fireImeConfirmEnter(input)
    expect(updateSettings).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()

    firePlainEnter(input)
    expect(updateSettings).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
