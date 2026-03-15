import { Component, inject, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GiveawayDetailStateService } from '../../services/giveaway-detail-state.service';

@Component({
    selector: 'app-reconfigure-awards-modal',
    standalone: true,
    imports: [ModalComponent],
    templateUrl: './reconfigure-awards-modal.component.html',
})
export class ReconfigureAwardsModalComponent {
    protected state = inject(GiveawayDetailStateService);
    private router = inject(Router);

    @Input() isOpen = signal(false);

    close(): void {
        this.isOpen.set(false);
    }

    async handleConfirm(): Promise<void> {
        const giveaway = this.state.giveaway();
        if (!giveaway) return;

        const newId = await this.state.reconfigureAwards({
            description: giveaway.description,
            giveawayDate: giveaway.giveawayDate,
            trStartDate: giveaway.trStartDate,
            trEndDate: giveaway.trEndDate,
        });

        if (newId) {
            this.close();
            this.router.navigate(['/giveaways', newId]);
        }
    }
}
