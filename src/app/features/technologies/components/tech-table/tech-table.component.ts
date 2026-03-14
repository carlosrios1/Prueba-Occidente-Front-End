import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Edit, Trash, LucideAngularModule, AppWindow, Server, Eye, ChevronRight, LucideIconData, Layers, Code } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from "@shared/components/buttons/button/button.component";
import { TechData, TechFormComponent } from '../tech-form/tech-form.component';
import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { TechStateService } from '@features/technologies/services/tech-state.service';
import { TechDeleteModalComponent } from '../tech-delete-modal/tech-delete-modal.component';
import { AppStatusPipe } from '@shared/pipes/active-or-disabled.pipe';
import { TechMapper } from '@features/technologies/utils/tech.mapper';
import { TechSummaryDto } from '@features/technologies/models/dtos/tech-environment.dto';
import { DropdownComponent } from "@shared/components/dropdown-menu/dropdown-menu.component";
import { BadgeVariant } from '@shared/components/badge/badge.config';

@Component({
  selector: 'app-tech-table',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BadgeComponent,
    TechDeleteModalComponent,
    TableCellDirective,
    AppStatusPipe,
  ],
  templateUrl: './tech-table.component.html'
})
export class TechTableComponent {
  // Inyectar el state service
  protected techState = inject(TechStateService);
  protected readonly mapper = TechMapper;
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  // Signals locales para modales
  selectedTechForDeletion = signal<TechSummaryDto | null>(null);
  isDeleteModalOpen = signal<boolean>(false);
  isDeleting = signal<boolean>(false);
  isEditing = signal<boolean>(false);



  readonly tableHeaders: string[] = [
    'ID',
    'Nombre',
    'Tipo',
    'Versiones Activas',
    'Versiones Totales',
    'Aplicativos',
    'Estado',
  ];

  readonly icons = {
    Edit,
    Trash,
    AppWindow,
    Server,
    Eye,
    ChevronRight
  };

  // =========================
  // ACCIONES
  // =========================

  openDeleteModal(tech: TechSummaryDto) {
    this.selectedTechForDeletion.set(tech);
    this.isDeleteModalOpen.set(true);
  }

  async handleDelete(): Promise<void> {
    const tech = this.selectedTechForDeletion();
    if (!tech) return;

    this.isDeleting.set(true);

    const success = await this.techState.deleteTech(tech.id);

    this.isDeleting.set(false);

    if (success) {
      console.log('SO eliminado correctamente');
      this.isDeleteModalOpen.set(false);
      this.selectedTechForDeletion.set(null);
      // Aquí podrías mostrar un toast o notificación
    }
  }

  mapCategoryToName = (apiCategory: string): string => {
    if (apiCategory === "lang") return "Lenguaje"
    if (apiCategory === "framework") return "Framework"
    return "Framework"
  }

  categoryColors: Record<string, BadgeVariant> = {
    Framework: "primary",
    Lenguaje: "cyan",
  }

  categoryIcons: Record<string, LucideIconData> = {
    Framework: Layers,
    Lenguaje: Code,
  }

  /**
   * Navega a la página de detalle de una tecnología
   */
  handleViewDetails(tech: TechSummaryDto): void {
    this.router.navigate(['/technologies', tech.name], {
      queryParams: {
        label: tech.label,
        category: tech.category
      }
    });
  }
}