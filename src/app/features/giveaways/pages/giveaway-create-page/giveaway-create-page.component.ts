import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Plus, Trash2, Info, Trophy } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { CardComponent } from '@shared/components/cards/card/card.component';
import { CardBodyComponent } from '@shared/components/cards/card/components/card-body.component';
import { CardHeaderComponent } from '@shared/components/cards/card/components/card-header.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { InputComponent } from '@shared/components/form-components/input/input/input.component';
import { LabelComponent } from '@shared/components/form-components/input/label/label.component';
import { InputErrorComponent } from '@shared/components/form-components/input/input-error/input-error.component';
import { InputWrapperComponent } from '@shared/components/form-components/input/input-wrapper/input-wrapper.component';
import { DatePickerComponent } from '@shared/components/date-picker/date-picker.component';
import { CustomSelectComponent, SelectOption } from '@shared/components/form-components/input/custom-select/custom-select.component';

import { GiveawaysStateService } from '../../services/giveaways-state.service';
import { AwardsHttpService } from '@features/awards/services/awards-http.service';
import { Award } from '@features/awards/models/award.model';

interface AwardEntry {
    awardId: number;
    winnersQuant: number;
}

@Component({
    selector: 'app-giveaway-create-page',
    standalone: true,
    imports: [
        FormsModule,
        LucideAngularModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        CardComponent,
        CardBodyComponent,
        CardHeaderComponent,
        ButtonComponent,
        InputComponent,
        LabelComponent,
        InputErrorComponent,
        InputWrapperComponent,
        DatePickerComponent,
        CustomSelectComponent,
    ],
    templateUrl: './giveaway-create-page.component.html',
})
export class GiveawayCreatePageComponent implements OnInit {
    protected state = inject(GiveawaysStateService);
    private awardsHttp = inject(AwardsHttpService);
    private router = inject(Router);

    readonly icons = { ArrowLeft, Plus, Trash2, Info, Trophy };

    availableAwards: Award[] = [];

    description = '';
    giveawayDate: Date | null = null;
    trStartDate: Date | null = null;
    trEndDate: Date | null = null;
    awardEntries: AwardEntry[] = [{ awardId: 0, winnersQuant: 1 }];

    ngOnInit(): void {
        this.loadAwards();
    }

    async loadAwards(): Promise<void> {
        try {
            const data = await firstValueFrom(this.awardsHttp.getAll(1, 100));
            this.availableAwards = data.items;
        } catch {
            this.availableAwards = [];
        }
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

    availableOptionsFor(index: number): SelectOption[] {
        return this.availableAwardsFor(index).map(a => ({ value: a.id, label: a.awardName }));
    }

    goBack(): void {
        this.router.navigate(['/giveaways']);
    }

    async handleSubmit(form: NgForm): Promise<void> {
        if (form.invalid) return;

        const validAwards = this.awardEntries.filter(e => e.awardId > 0 && e.winnersQuant > 0);
        if (validAwards.length === 0) return;

        const success = await this.state.create({
            giveAwayDate: this.dateToIso(this.giveawayDate),
            trStartDate: this.dateToIso(this.trStartDate),
            trEndDate: this.dateToIso(this.trEndDate),
            description: this.description.trim(),
            awards: validAwards,
        });

        if (success) {
            this.router.navigate(['/giveaways']);
        }
    }
}
