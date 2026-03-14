import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, GitBranch, Users } from 'lucide-angular';
import { ProjectCard, TechnologyColor } from './project-card.interface';
import { CardComponent } from "../card/card.component";
import { CardBodyComponent } from "../card/components/card-body.component";
import { BadgeComponent } from "../../badge/badge.component";
import { BadgeVariant } from '../../badge/badge.config';

@Component({
    selector: 'app-project-card',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, CardComponent, CardBodyComponent, BadgeComponent],
    templateUrl: './project-card.component.html',
})
export class ProjectCardComponent {
    @Input({ required: true }) project!: ProjectCard;

    // Lucide icons
    readonly icons = {
        GitBranch,
        Users
    }

    getTechnologyVariant(color: TechnologyColor): BadgeVariant {
        const variantMap: Record<TechnologyColor, BadgeVariant> = {
            red: 'danger',
            green: 'success',
            blue: 'info',
            yellow: 'warning',
            purple: 'purple',
            orange: 'orange'
        };
        return variantMap[color] || 'default';
    }

    onCardClick(): void {
        // Emite evento o navega a detalle del proyecto
        console.log('Project clicked:', this.project.title);
    }
}