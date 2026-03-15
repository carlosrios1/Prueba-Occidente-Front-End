import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStateService } from '@features/auth/services/auth-state.service';

export const authGuard: CanActivateFn = () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);

    if (authState.getToken()) {
        return true;
    }

    return router.createUrlTree(['/auth/log-in']);
};
