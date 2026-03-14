import { Component } from '@angular/core';

@Component({
    selector: 'app-info-card-subtitle',
    standalone: true,
    template: `
    <div class="flex">
      <ng-content></ng-content>
    </div>
  `,
})
export class InfoCardSubtitleComponent { }
