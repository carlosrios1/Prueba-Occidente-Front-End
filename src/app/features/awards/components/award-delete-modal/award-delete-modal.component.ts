import { Component, inject, Input, signal } from '@angular/core';
import { LucideAngularModule, AlertCircle } from 'lucide-angular';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { AwardsStateService } from '../../services/awards-state.service';
import { Award } from '../../models/award.model';

@Component({
    selector: 'app-award-delete-modal',
    standalone: true,
    imports: [ModalComponent, LucideAngularModule],
    templateUrl: './award-delete-modal.component.html',
})
export class AwardDeleteModalComponent {
    protected state = inject(AwardsStateService);

    @Input() award: Award | null = null;
    @Input() isOpen = signal(false);

    readonly icons = { AlertCircle };
    errorMessage = signal<string | null>(null);

    close(): void {
        this.errorMessage.set(null);
        this.isOpen.set(false);
    }

    async handleDelete(): Promise<void> {
        if (!this.award) return;
        this.errorMessage.set(null);
        const success = await this.state.delete(this.award.id);
        if (success) {
            this.close();
        } else {
            this.errorMessage.set(this.state.lastErrorMessage() ?? 'Ocurrió un error al eliminar el premio.');
        }
    }
}
