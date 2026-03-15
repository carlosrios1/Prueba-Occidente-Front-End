import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule, Trophy } from 'lucide-angular';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { InputComponent } from '@shared/components/form-components/input/input/input.component';
import { TextareaComponent } from '@shared/components/form-components/input/textarea/textarea.component';
import { LabelComponent } from '@shared/components/form-components/input/label/label.component';
import { InputErrorComponent } from '@shared/components/form-components/input/input-error/input-error.component';
import { InputWrapperComponent } from '@shared/components/form-components/input/input-wrapper/input-wrapper.component';
import { AwardsStateService } from '../../services/awards-state.service';
import { Award } from '../../models/award.model';

@Component({
    selector: 'app-award-form-modal',
    standalone: true,
    imports: [
        ModalComponent,
        FormsModule,
        LucideAngularModule,
        InputComponent,
        TextareaComponent,
        LabelComponent,
        InputErrorComponent,
        InputWrapperComponent,
    ],
    templateUrl: './award-form-modal.component.html',
})
export class AwardFormModalComponent implements OnChanges {
    protected state = inject(AwardsStateService);

    @Input() isOpen = signal(false);
    /** Si se pasa un award, el modal opera en modo edición; si null, modo creación. */
    @Input() award: Award | null = null;

    readonly icons = { Trophy };

    awardName = '';
    description = '';

    get isEditing(): boolean {
        return this.award !== null;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['award']) {
            if (this.award) {
                this.awardName = this.award.awardName;
                this.description = this.award.description;
            } else {
                this.awardName = '';
                this.description = '';
            }
        }
    }

    close(): void {
        this.isOpen.set(false);
    }

    async handleSubmit(form: NgForm): Promise<void> {
        if (form.invalid) return;

        let success: boolean;

        if (this.isEditing && this.award) {
            success = await this.state.update(this.award.id, {
                awardName: this.awardName.trim(),
                description: this.description.trim(),
            });
        } else {
            success = await this.state.create({
                awardname: this.awardName.trim(),
                description: this.description.trim(),
            });
        }

        if (success) {
            form.resetForm();
            this.close();
        }
    }
}
