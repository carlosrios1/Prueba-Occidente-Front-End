import {
    Component, inject, Input, OnChanges, OnInit,
    signal, SimpleChanges
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule, Trophy } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { InputComponent } from '@shared/components/form-components/input/input/input.component';
import { LabelComponent } from '@shared/components/form-components/input/label/label.component';
import { InputErrorComponent } from '@shared/components/form-components/input/input-error/input-error.component';
import { InputWrapperComponent } from '@shared/components/form-components/input/input-wrapper/input-wrapper.component';

import { GiveawayDetailStateService } from '../../services/giveaway-detail-state.service';
import { AwardsHttpService } from '@features/awards/services/awards-http.service';
import { GiveawayAward } from '../../models/giveaway.model';
import { Award } from '@features/awards/models/award.model';

@Component({
    selector: 'app-giveaway-award-form-modal',
    standalone: true,
    imports: [
        ModalComponent,
        FormsModule,
        LucideAngularModule,
        InputComponent,
        LabelComponent,
        InputErrorComponent,
        InputWrapperComponent,
    ],
    templateUrl: './giveaway-award-form-modal.component.html',
})
export class GiveawayAwardFormModalComponent implements OnChanges, OnInit {
    protected state = inject(GiveawayDetailStateService);
    private awardsHttp = inject(AwardsHttpService);

    @Input() isOpen = signal(false);
    /** Si se pasa, opera en modo edición (solo cambia winnersQuant). Si null, modo agregar. */
    @Input() award: GiveawayAward | null = null;

    readonly icons = { Trophy };

    availableAwards: Award[] = [];
    selectedAwardId = 0;
    winnersQuant = 1;

    get isEditing(): boolean {
        return this.award !== null;
    }

    get filteredAvailableAwards(): Award[] {
        const usedIds = this.state.localAwards()
            .filter(a => a.awardId !== this.award?.awardId)
            .map(a => a.awardId);
        return this.availableAwards.filter(a => !usedIds.includes(a.id));
    }

    ngOnInit(): void {
        this.loadAwards();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['award']) {
            if (this.award) {
                this.selectedAwardId = this.award.awardId;
                this.winnersQuant = this.award.winnersQuant;
            } else {
                this.selectedAwardId = 0;
                this.winnersQuant = 1;
            }
        }
    }

    async loadAwards(): Promise<void> {
        try {
            const data = await firstValueFrom(this.awardsHttp.getAll(1, 100));
            this.availableAwards = data.items;
        } catch {
            this.availableAwards = [];
        }
    }

    close(): void {
        this.isOpen.set(false);
    }

    async handleSubmit(form: NgForm): Promise<void> {
        if (form.invalid || this.selectedAwardId === 0) return;

        if (this.isEditing && this.award) {
            this.state.updateLocalAward(this.award.awardId, this.winnersQuant);
        } else {
            const selectedAward = this.availableAwards.find(a => a.id === this.selectedAwardId);
            if (!selectedAward) return;
            this.state.addLocalAward({
                awardId: selectedAward.id,
                awardName: selectedAward.awardName,
                winnersQuant: this.winnersQuant,
            });
        }

        this.close();
    }
}
