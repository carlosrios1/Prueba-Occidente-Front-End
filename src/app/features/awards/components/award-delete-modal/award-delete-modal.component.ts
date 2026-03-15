import { Component, inject, Input, signal } from '@angular/core';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { AwardsStateService } from '../../services/awards-state.service';
import { Award } from '../../models/award.model';

@Component({
    selector: 'app-award-delete-modal',
    standalone: true,
    imports: [ModalComponent],
    templateUrl: './award-delete-modal.component.html',
})
export class AwardDeleteModalComponent {
    protected state = inject(AwardsStateService);

    @Input() award: Award | null = null;
    @Input() isOpen = signal(false);

    close(): void {
        this.isOpen.set(false);
    }

    async handleDelete(): Promise<void> {
        if (!this.award) return;
        const success = await this.state.delete(this.award.id);
        if (success) this.close();
    }
}
