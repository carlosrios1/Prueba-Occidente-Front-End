import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-avatar',
    standalone: true,
    templateUrl: './avatar.component.html',
})
export class AvatarComponent implements OnInit {
    @Input() name: string = '';
    @Input() size: 'xs' | 'sm' | 'md' | 'base' | 'lg' = 'md';
    @Input() bgColor?: string; // color personalizado opcional

    initials: string = '';
    background: string = '';
    sizeClasses: string = '';

    private colors = [
        'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-800/20 dark:to-amber-800/20 text-orange-500',
        'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800/20 dark:to-emerald-800/20 text-green-500',
        'bg-gradient-to-r from-blue-100 to-blue-100 dark:from-blue-800/20 dark:to-blue-800/20 text-blue-500',
        'bg-gradient-to-r from-purple-100 to-violet-100 dark:from-violet-800/20 dark:to-purple-800/20 text-purple-500',
        'bg-gradient-to-r from-neutral-200 to-neutral-200 dark:from-neutral-400/20 dark:to-neutral-400/20 dark:text-neutral-100 text-neutral-900',        // negro / gris muy oscuro
    ];


    ngOnInit() {
        this.initials = this.getInitials(this.name);
        this.background = this.bgColor ?? this.getColor(this.name);
        this.sizeClasses = this.getSizeClasses(this.size);
    }

    private getInitials(name: string): string {
        if (!name) return '?';
        const clean = name.trim().replace(/\s+/g, ' ');
        const parts = clean.split(' ');

        if (parts.length > 1) {
            // Si tiene varias palabras, toma la primera y última letra
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else {
            // Si solo hay una palabra, toma las dos primeras letras
            return clean.slice(0, 2).toUpperCase();
        }
    }

    private getColor(name: string): string {
        const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return this.colors[hash % this.colors.length];
    }

    private getSizeClasses(size: 'xs' | 'sm' | 'md' | 'base' | 'lg'): string {
        switch (size) {
            case 'xs':
                return 'w-6 h-6 text-xs';
            case 'sm':
                return 'w-8 h-8 text-xs';
            case 'md':
                return 'w-12 h-12 text-base';
            case 'base':
                return 'w-10 h-10';
            case 'lg':
                return 'w-16 h-16 text-xl';
            default:
                return 'w-12 h-12 text-base';
        }
    }
}
