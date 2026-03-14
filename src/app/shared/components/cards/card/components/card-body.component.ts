import { Component } from '@angular/core';

@Component({
    selector: 'app-card-body',
    standalone: true,
    template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
})
export class CardBodyComponent { }
