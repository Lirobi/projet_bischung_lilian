import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HasUnsavedChanges, unsavedChangesGuard } from './unsaved-changes';

describe('unsavedChangesGuard', () => {
  const run = (dirty: boolean) => {
    const component: HasUnsavedChanges = { hasUnsavedChanges: () => dirty };
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    return unsavedChangesGuard(component, route, state, state);
  };

  afterEach(() => vi.restoreAllMocks());

  it('laisse partir sans question quand rien n’a changé', () => {
    const confirm = vi.spyOn(window, 'confirm');
    expect(run(false)).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
  });

  it('demande confirmation quand la saisie est modifiée', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    expect(run(true)).toBe(true);
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    expect(run(true)).toBe(false);
  });
});
