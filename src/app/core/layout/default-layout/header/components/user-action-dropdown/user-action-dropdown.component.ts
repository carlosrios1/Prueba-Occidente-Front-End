import { Component } from '@angular/core';

//IMPORT LUCIDE
import {
    LucideAngularModule,
    LogOut,
    ChevronDown,
} from 'lucide-angular';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';
import { DropdownComponent } from '../../../../../../shared/components/dropdown-menu/dropdown-menu.component';
import { AvatarComponent } from '../../../../../../shared/components/avatar/avatar.component';



@Component({
    selector: 'app-user-action-dropdown',
    standalone: true,
    imports: [LucideAngularModule, ButtonComponent, DropdownComponent, AvatarComponent],
    templateUrl: './user-action-dropdown.component.html',
})
export class UserActionDropdownComponent {
    readonly icons = {
        LogOut,
        ChevronDown
    }

    isDropdownOpen = false;

    toggleDropdown() {
        // Toggle con un pequeño delay para sincronizar con la apertura del dropdown
        setTimeout(() => {
            this.isDropdownOpen = !this.isDropdownOpen;
        }, 0);
    }
}