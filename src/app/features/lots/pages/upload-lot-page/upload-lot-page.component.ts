import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { LotsHttpService } from '../../services/lots-http.service';
import { LotsStateService } from '../../services/lots-state.service';
import { LotUploadComponent } from '../../components/lot-upload/lot-upload.component';

@Component({
  selector: 'app-upload-lot-page',
  standalone: true,
  imports: [
    LucideAngularModule,
    PageBodyLayoutComponent,
    PageHeaderComponent,
    ButtonComponent,
    LotUploadComponent,
  ],
  providers: [LotsHttpService, LotsStateService],
  template: `
    <app-page-body-layout>
      <div header>
        <app-page-header title="Cargar transacciones" description="Sube un archivo Excel con el lote de transacciones">
          <div actions>
            <app-button [variant]="'neutral'" [appearance]="'outline'" [size]="'medium'" [type]="'button'" [icon]="icons.ArrowLeft" (onClick)="goBack()">
              Volver
            </app-button>
          </div>
        </app-page-header>
      </div>
      <div body class="motion-preset-slide-left">
        <div class="max-w-xl bg-white dark:bg-base-100 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 p-6">
          <app-lot-upload (cancel)="goBack()" (uploaded)="onUploaded()" />
        </div>
      </div>
    </app-page-body-layout>
  `
})
export class UploadLotPageComponent {
  private router = inject(Router);
  readonly icons = { ArrowLeft };

  goBack(): void {
    this.router.navigate(['/lots']);
  }

  onUploaded(): void {
    this.router.navigate(['/lots']);
  }
}
