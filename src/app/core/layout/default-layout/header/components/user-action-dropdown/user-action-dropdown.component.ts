import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

//IMPORT LUCIDE
import {
    LucideAngularModule,
    LogOut,
    ChevronDown,
} from 'lucide-angular';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';
import { DropdownComponent } from '../../../../../../shared/components/dropdown-menu/dropdown-menu.component';
import { AvatarComponent } from '../../../../../../shared/components/avatar/avatar.component';
import { AuthStateService } from '@features/auth/services/auth-state.service';

@Component({
    selector: 'app-user-action-dropdown',
    standalone: true,
    imports: [LucideAngularModule, ButtonComponent, DropdownComponent, AvatarComponent],
    templateUrl: './user-action-dropdown.component.html',
})
export class UserActionDropdownComponent {
    private authState = inject(AuthStateService);
    private router = inject(Router);

    readonly icons = { LogOut, ChevronDown };
    readonly username = this.authState.username;

    isDropdownOpen = false;

    toggleDropdown() {
        setTimeout(() => {
            this.isDropdownOpen = !this.isDropdownOpen;
        }, 0);
    }

    logout() {
        this.authState.clearSession();
        this.router.navigate(['/auth/log-in']);
    }
}