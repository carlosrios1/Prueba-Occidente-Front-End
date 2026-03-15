import { Component, inject, Input, signal } from '@angular/core';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GiveawaysStateService } from '../../services/giveaways-state.service';
import { GiveawaySummary } from '../../models/giveaway.model';

@Component({
    selector: 'app-giveaway-delete-modal',
    standalone: true,
    imports: [ModalComponent],
    templateUrl: './giveaway-delete-modal.component.html',
})
export class GiveawayDeleteModalComponent {
    protected state = inject(GiveawaysStateService);

    @Input() giveaway: GiveawaySummary | null = null;
    @Input() isOpen = signal(false);

    close(): void {
        this.isOpen.set(false);
    }

    async handleDelete(): Promise<void> {
        if (!this.giveaway) return;
        const success = await this.state.delete(this.giveaway.id);
        if (success) this.close();
    }
}
