import { Component } from '@angular/core';

@Component({
    selector: 'app-info-card-title',
    standalone: true,
    template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
})
export class InfoCardTitleComponent { }
