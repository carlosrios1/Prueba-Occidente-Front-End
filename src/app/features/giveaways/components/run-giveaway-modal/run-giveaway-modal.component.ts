import { Component, inject, Input, signal } from '@angular/core';
import { LucideAngularModule, Play, Trophy, Users, Star } from 'lucide-angular';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { GiveawayDetailStateService } from '../../services/giveaway-detail-state.service';
import { RunGiveawayResponse } from '../../models/giveaway-responses.model';

@Component({
    selector: 'app-run-giveaway-modal',
    standalone: true,
    imports: [ModalComponent, LucideAngularModule],
    templateUrl: './run-giveaway-modal.component.html',
})
export class RunGiveawayModalComponent {
    protected state = inject(GiveawayDetailStateService);

    @Input() isOpen = signal(false);
    @Input() result: RunGiveawayResponse | null = null;

    readonly icons = { Play, Trophy, Users, Star };

    get hasResult(): boolean {
        return this.result !== null;
    }

    close(): void {
        this.isOpen.set(false);
    }

    async run(): Promise<void> {
        const res = await this.state.run();
        if (res) {
            this.result = res;
        }
    }
}
