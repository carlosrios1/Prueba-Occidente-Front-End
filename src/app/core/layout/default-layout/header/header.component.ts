import { Component } from '@angular/core';

import { SidebarTogglerComponent } from "./components/sidebar-toggler/sidebar-toggler.component";
import { UserActionDropdownComponent } from "./components/user-action-dropdown/user-action-dropdown.component";
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BreadcrumbComponent, SidebarTogglerComponent, UserActionDropdownComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
}
