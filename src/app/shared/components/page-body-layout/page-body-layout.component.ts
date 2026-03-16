import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-body-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full flex flex-col gap-5">
      <div class="w-full flex flex-col border-b dark:border-b-neutral-800 p-6 bg-white dark:bg-blackBG motion-preset-fade motion-duration-500 motion-ease-spring-smooth z-9">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="w-full flex flex-col dark:bg-blackBG px-6 gap-6 pb-6">
        <ng-content select="[body]" ></ng-content>
      </div>
    </div>
  `
})
export class PageBodyLayoutComponent { }