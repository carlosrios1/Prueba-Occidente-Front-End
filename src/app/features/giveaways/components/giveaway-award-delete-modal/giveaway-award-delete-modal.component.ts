import { Component, computed, inject, Input, signal } from '@angular/core';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GiveawayDetailStateService } from '../../services/giveaway-detail-state.service';
import { GiveawayAward } from '../../models/giveaway.model';

@Component({
    selector: 'app-giveaway-award-delete-modal',
    standalone: true,
    imports: [ModalComponent],
    templateUrl: './giveaway-award-delete-modal.component.html',
})
export class GiveawayAwardDeleteModalComponent {
    protected state = inject(GiveawayDetailStateService);

    @Input() award: GiveawayAward | null = null;
    @Input() isOpen = signal(false);

    get subtitle(): string {
        return `¿Deseas quitar el premio <strong>${this.award?.awardName ?? ''}</strong> de este sorteo? Los cambios no se guardarán hasta que pulses "Guardar premios".`;
    }

    close(): void {
        this.isOpen.set(false);
    }

    handleDelete(): void {
        if (!this.award) return;
        this.state.removeLocalAward(this.award.awardId);
        this.close();
    }
}
