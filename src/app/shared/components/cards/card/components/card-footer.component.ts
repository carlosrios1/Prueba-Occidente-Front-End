import { Component } from '@angular/core';

@Component({
    selector: 'app-card-footer',
    standalone: true,
    template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
})
export class CardFooterComponent { }
