import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { filter, firstValueFrom, interval, Subscription } from 'rxjs';
import { SidebarToggleService } from '../sidebar/sidebarToggle.service';
import { CommonModule } from '@angular/common';
import { AlertCircle, LucideAngularModule, RefreshCcw } from 'lucide-angular';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';


@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    RouterModule,
    SidebarComponent,
    HeaderComponent,
    LoaderComponent,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  private router = inject(Router)
  readonly Alert = AlertCircle;
  readonly refresh = RefreshCcw;
  showModal = false;
  isCollapsed = false;
  isMobileSidebarOpen = false;
  sidebarToggleService = inject(SidebarToggleService);
  loadingSession = false;

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
