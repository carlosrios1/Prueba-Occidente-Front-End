import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarToggleService } from '../sidebar/sidebarToggle.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';


@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    RouterModule,
    SidebarComponent,
    HeaderComponent,
    LoaderComponent,
    CommonModule,
  ],
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  private router = inject(Router)
  isCollapsed = false;
  isMobileSidebarOpen = false;
  sidebarToggleService = inject(SidebarToggleService);

  ngOnInit() {
    this.sidebarToggleService.isCollapsed$.subscribe((collapsed) => {
      this.isCollapsed = collapsed;
    });

    this.sidebarToggleService.isMobileSidebarOpen$.subscribe(isOpen => {
      this.isMobileSidebarOpen = isOpen;
    });
  }

  ngAfterViewInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      // 🔥 Reinicia el scroll del contenedor cada vez que cambia la ruta
      this.scrollContainer.nativeElement.scrollTo({ top: 0, behavior: 'auto' });
    });
  }
}
