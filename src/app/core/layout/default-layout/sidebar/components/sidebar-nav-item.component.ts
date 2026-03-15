import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';

export interface NavItem {
  name: string;
  label: string;
  link: string;
  icon: any;
  aria: string;
}

@Component({
  selector: 'app-sidebar-nav-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonComponent],
  template: `
    <li class="dark" [class.overflow-hidden]="!iconOnly" [class.flex]="iconOnly" [class.flex-col]="iconOnly" [class.items-center]="iconOnly">
      <app-button 
        [class.flex]="iconOnly"
        [size]="'medium'" 
        [type]="'button'" 
        [variant]="rla.isActive ? 'success' : 'black'"
        #rla="routerLinkActive" 
        [attr.aria-label]="item.aria" 
        [appearance]="rla.isActive ? 'solid' : 'text'"
        [icon]="item.icon" 
        [fullWidth]="!iconOnly" 
        [title]="item.name" 
        [routerLink]="item.link"
        routerLinkActive="active-link"
        (OnClick)="itemClick.emit()">
        @if (!iconOnly) {
          <span class="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{{item.label}}</span>
        }
      </app-button>
    </li>
  `
})
export class SidebarNavItemComponent {
  @Input() item!: NavItem;
  @Input() iconOnly = false;
  @Output() itemClick = new EventEmitter<void>();
}