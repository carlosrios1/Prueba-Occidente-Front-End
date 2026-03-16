import { Component, inject, Input, signal } from '@angular/core';
import { LucideAngularModule, Play, Trophy, Users, Star, AlertCircle } from 'lucide-angular';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { GiveawayDetailStateService } from '../../services/giveaway-detail-state.service';
import { RunGiveawayResponse } from '../../models/giveaway-responses.model';
import { GiveawaySuspenseComponent } from '../giveaway-suspense/giveaway-suspense.component';
import { GiveawayConfettiComponent } from '../giveaway-confetti/giveaway-confetti.component';

const MIN_SUSPENSE_MS = 3500;
const CONFETTI_DURATION_MS = 5000;

@Component({
    selector: 'app-run-giveaway-modal',
    standalone: true,
    imports: [ModalComponent, LucideAngularModule, GiveawaySuspenseComponent, GiveawayConfettiComponent],
    templateUrl: './run-giveaway-modal.component.html',
})
export class RunGiveawayModalComponent {
    protected state = inject(GiveawayDetailStateService);

    @Input() isOpen = signal(false);
    @Input() result: RunGiveawayResponse | null = null;

    isShowingSuspense = signal(false);
    showConfetti = signal(false);
    errorMessage = signal<string | null>(null);

    readonly icons = { Play, Trophy, Users, Star, AlertCircle };

    get hasResult(): boolean {
        return this.result !== null;
    }

    close(): void {
        this.errorMessage.set(null);
        this.isOpen.set(false);
        this.showConfetti.set(false);
    }

    async run(): Promise<void> {
        this.errorMessage.set(null);
        this.isShowingSuspense.set(true);
        try {
            const minDelay = new Promise<void>(resolve => setTimeout(resolve, MIN_SUSPENSE_MS));
            const [res] = await Promise.all([this.state.run(), minDelay]);
            if (res) {
                this.result = res;
                this.showConfetti.set(true);
                setTimeout(() => this.showConfetti.set(false), CONFETTI_DURATION_MS);
            } else {
                this.errorMessage.set(this.state.lastErrorMessage() ?? 'No se pudo ejecutar el sorteo.');
            }
        } finally {
            this.isShowingSuspense.set(false);
        }
    }
}
