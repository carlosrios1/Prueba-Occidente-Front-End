import {
    Component, inject, Input, OnChanges, OnInit,
    signal, SimpleChanges
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule, Shuffle, Plus, Trash2 } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { InputComponent } from '@shared/components/form-components/input/input/input.component';
import { LabelComponent } from '@shared/components/form-components/input/label/label.component';
import { InputErrorComponent } from '@shared/components/form-components/input/input-error/input-error.component';
import { InputWrapperComponent } from '@shared/components/form-components/input/input-wrapper/input-wrapper.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { DatePickerComponent } from '@shared/components/date-picker/date-picker.component';

import { GiveawaysStateService } from '../../services/giveaways-state.service';
import { AwardsHttpService } from '@features/awards/services/awards-http.service';
import { GiveawaySummary } from '../../models/giveaway.model';
import { Award } from '@features/awards/models/award.model';

interface AwardEntry {
    awardId: number;
    winnersQuant: number;
}

@Component({
    selector: 'app-giveaway-form-modal',
    standalone: true,
    imports: [
        ModalComponent,
        FormsModule,
        LucideAngularModule,
        InputComponent,
        LabelComponent,
        InputErrorComponent,
        InputWrapperComponent,
        ButtonComponent,
        DatePickerComponent,
    ],
    templateUrl: './giveaway-form-modal.component.html',
})
export class GiveawayFormModalComponent implements OnChanges, OnInit {
    protected state = inject(GiveawaysStateService);
    private awardsHttp = inject(AwardsHttpService);

    @Input() isOpen = signal(false);
    /** Si se pasa un sorteo, opera en modo edición; si null, modo creación. */
    @Input() giveaway: GiveawaySummary | null = null;

    readonly icons = { Shuffle, Plus, Trash2 };

    availableAwards: Award[] = [];

    description = '';
    giveawayDate: Date | null = null;
    trStartDate: Date | null = null;
    trEndDate: Date | null = null;
    awardEntries: AwardEntry[] = [{ awardId: 0, winnersQuant: 1 }];

    get isEditing(): boolean {
        return this.giveaway !== null;
    }

    ngOnInit(): void {
        this.loadAwards();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['giveaway']) {
            if (this.giveaway) {
                this.description = this.giveaway.description;
                this.giveawayDate = this.isoToDate(this.giveaway.giveawayDate);
                this.trStartDate = this.isoToDate(this.giveaway.trStartDate);
                this.trEndDate = this.isoToDate(this.giveaway.trEndDate);
                this.awardEntries = [{ awardId: 0, winnersQuant: 1 }];
            } else {
                this.resetForm();
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

    private isoToDate(iso: string): Date | null {
        if (!iso) return null;
        const d = new Date(iso);
        return isNaN(d.getTime()) ? null : d;
    }

    private dateToIso(date: Date | null): string {
        if (!date) return '';
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}T00:00:00`;
    }

    addAwardEntry(): void {
        this.awardEntries = [...this.awardEntries, { awardId: 0, winnersQuant: 1 }];
    }

    removeAwardEntry(index: number): void {
        if (this.awardEntries.length > 1) {
            this.awardEntries = this.awardEntries.filter((_, i) => i !== index);
        }
    }

    availableAwardsFor(index: number): Award[] {
        const usedIds = this.awardEntries
            .filter((_, i) => i !== index)
            .map(e => e.awardId);
        return this.availableAwards.filter(a => !usedIds.includes(a.id));
    }

    close(): void {
        this.isOpen.set(false);
    }

    resetForm(): void {
        this.description = '';
        this.giveawayDate = null;
        this.trStartDate = null;
        this.trEndDate = null;
        this.awardEntries = [{ awardId: 0, winnersQuant: 1 }];
    }

    async handleSubmit(form: NgForm): Promise<void> {
        if (form.invalid) return;

        let success: boolean;

        if (this.isEditing && this.giveaway) {
            success = await this.state.update(this.giveaway.id, {
                giveawayDate: this.dateToIso(this.giveawayDate),
                trStartDate: this.dateToIso(this.trStartDate),
                trEndDate: this.dateToIso(this.trEndDate),
                description: this.description.trim(),
            });
        } else {
            const validAwards = this.awardEntries.filter(e => e.awardId > 0 && e.winnersQuant > 0);
            if (validAwards.length === 0) return;

            success = await this.state.create({
                giveAwayDate: this.dateToIso(this.giveawayDate),
                trStartDate: this.dateToIso(this.trStartDate),
                trEndDate: this.dateToIso(this.trEndDate),
                description: this.description.trim(),
                awards: validAwards,
            });
        }

        if (success) {
            form.resetForm();
            this.resetForm();
            this.close();
        }
    }
}
