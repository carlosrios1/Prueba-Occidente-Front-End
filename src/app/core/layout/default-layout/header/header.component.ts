import { Component } from '@angular/core';

import { ThemeTogglerComponent } from "./components/theme-toggler/theme-toggler.component";
import { SidebarTogglerComponent } from "./components/sidebar-toggler/sidebar-toggler.component";
import { UserActionDropdownComponent } from "./components/user-action-dropdown/user-action-dropdown.component";
import { HeaderLogoComponent } from "./components/mobile-logo/mobile-logo.component";
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BreadcrumbComponent, ThemeTogglerComponent, SidebarTogglerComponent, UserActionDropdownComponent, HeaderLogoComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
}
