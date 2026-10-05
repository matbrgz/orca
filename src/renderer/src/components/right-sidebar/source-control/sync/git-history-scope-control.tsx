import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { translate } from '@/i18n/i18n'
import type { GitHistoryScope } from '../../../../../../shared/git-history'

export function GitHistoryScopeControl({
  scope,
  onScopeChange
}: {
  scope: GitHistoryScope
  onScopeChange: (scope: GitHistoryScope) => void
}): React.JSX.Element {
  return (
    <div className="px-3 pb-1.5">
      <ToggleGroup
        type="single"
        value={scope}
        onValueChange={(value) => {
          if (value === 'current' || value === 'all') {
            onScopeChange(value)
          }
        }}
        variant="outline"
        size="sm"
        aria-label={translate(
          'auto.components.right.sidebar.GitHistoryPanel.historyScope',
          'Commit history scope'
        )}
        className="h-6 w-full justify-stretch"
      >
        <ToggleGroupItem value="current" className="h-6 grow basis-0 px-1 text-[10px]">
          {translate(
            'auto.components.right.sidebar.GitHistoryPanel.currentBranch',
            'Current branch'
          )}
        </ToggleGroupItem>
        <ToggleGroupItem value="all" className="h-6 grow basis-0 px-1 text-[10px]">
          {translate('auto.components.right.sidebar.GitHistoryPanel.allBranches', 'All branches')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
