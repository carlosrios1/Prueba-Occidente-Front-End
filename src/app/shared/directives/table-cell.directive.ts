import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[appTableCell]',
    standalone: true
})
export class TableCellDirective {
    @Input() variant: 'default' | 'first' | 'name' | 'badge' | 'actions' | 'last' = 'default';

    @HostBinding('class')
    get classes(): string {
        const variants = {
            first: 'pl-4 pr-2 py-3 text-start text-sm text-neutral-800 dark:text-neutral-100 font-semibold',
            name: 'px-2 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-100 max-w-xs truncate text-start tracking-tight',
            default: 'px-2 py-3 text-sm font-normal text-neutral-600 dark:text-neutral-200 max-w-xs truncate tracking-tight text-start',
            badge: 'px-2 py-4 text-start',
            actions: 'px-2 py-0 text-start gap-2',
            last: 'pl-4 pr-2 py-3 text-end text-sm text-neutral-800 dark:text-neutral-100 font-semibold',
        };

        return variants[this.variant];
    }
}