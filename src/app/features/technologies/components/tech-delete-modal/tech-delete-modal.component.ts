import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TechSummaryDto } from '@features/technologies/models/dtos/tech-environment.dto';

@Component({
    selector: 'app-tech-delete-modal',
    standalone: true,
    imports: [CommonModule, ModalComponent],
    templateUrl: './tech-delete-modal.component.html'
})
export class TechDeleteModalComponent {
    @Input() tech: TechSummaryDto | null = null;
    @Input() isOpen = signal<boolean>(false);
    @Input() isDeleting = signal<boolean>(false);
    @Output() onConfirm = new EventEmitter<void>();


    get titleDeleteModal(): string {
        if (!this.tech) return '';
        return this.handleTitle(this.tech.deletion.possible);
    }

    get subtitleDeleteModal(): string {
        if (!this.tech) return '';
        return this.handleSubtitle(this.tech.name, this.tech.deletion.linkedServersCount);
    }

    get showConfirmButton(): boolean {
        return this.tech ? this.tech.deletion.possible : false;
    }

    get cancelText(): string {
        return this.tech && !this.tech.deletion.possible ? 'Entendido' : 'Cancelar';
    }

    handleTitle(canDelete: boolean): string {
        if (canDelete) {
            return '¿Está seguro que desea eliminar este Ambiente?';
        } else {
            return `No se puede eliminar`;
        }
    }

    handleSubtitle(name: string, linkedServersCount: number): string {
        if (linkedServersCount > 0) {
            return `El ambiente <strong>${name}</strong> no puede ser eliminado porque tiene <strong>${linkedServersCount}</strong> servidores asociados.<br><br>Primero debe reasignar o eliminar los servidores que utilizan este ambiente.`;
        }
        return `¿Está seguro que desea eliminar el ambiente <strong>${name}</strong>?`;
    }

    closeDeleteModal() {
        this.isOpen.set(false);
        console.log('Cerrar modal de eliminación', this.isOpen());
        // El modal component ya maneja el cierre, aquí podríamos resetear estado si fuera necesario
    }

    handleDelete() {
        if (!this.tech) return;

        // Emitir el evento al componente padre para que maneje la eliminación
        this.onConfirm.emit();
    }
}