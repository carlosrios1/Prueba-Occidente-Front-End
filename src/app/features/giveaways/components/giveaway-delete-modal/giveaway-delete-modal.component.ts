import { Component, inject, Input, signal } from '@angular/core';
import { LucideAngularModule, AlertCircle } from 'lucide-angular';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GiveawaysStateService } from '../../services/giveaways-state.service';
import { GiveawaySummary } from '../../models/giveaway.model';

@Component({
    selector: 'app-giveaway-delete-modal',
    standalone: true,
    imports: [ModalComponent, LucideAngularModule],
    templateUrl: './giveaway-delete-modal.component.html',
})
export class GiveawayDeleteModalComponent {
    protected state = inject(GiveawaysStateService);

    @Input() giveaway: GiveawaySummary | null = null;
    @Input() isOpen = signal(false);

    readonly icons = { AlertCircle };
    errorMessage = signal<string | null>(null);

    close(): void {
        this.errorMessage.set(null);
        this.isOpen.set(false);
    }

    async handleDelete(): Promise<void> {
        if (!this.giveaway) return;
        this.errorMessage.set(null);
        const success = await this.state.delete(this.giveaway.id);
        if (success) {
            this.close();
        } else {
            this.errorMessage.set(this.state.lastErrorMessage() ?? 'Ocurrió un error al eliminar el sorteo.');
        }
    }
}
