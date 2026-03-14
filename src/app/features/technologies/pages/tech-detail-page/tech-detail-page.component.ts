import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, LucideIconData, RefreshCw, ExternalLink, ChevronLeft, ChevronRight, Info, ArrowLeft, Layers, Code } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { TechStateService } from '../../services/tech-state.service';
import { getVersionStatus, formatDate } from '../../utils/tech-version-status.util';
import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from "@shared/components/header/app-page-header-component";
import { BadgeComponent } from "@shared/components/badge/badge.component";
import { BadgeVariant } from '@shared/components/badge/badge.config';
import { ButtonComponent } from "@shared/components/buttons/button/button.component";
// import { TechListComponent } from "@features/technologies/components/tech-list/tech-list.component";
import { TechDetailSummaryComponent } from '@features/technologies/components/tech-detail/tech-detail-summary/tech-detail-summary.component';
import { TechVersionTableSectionComponent } from '@features/technologies/components/tech-detail/tech-version-table-section/tech-version-table-section.component';
import { CardComponent } from "@shared/components/cards/card/card.component";
import { CardHeaderComponent } from "@shared/components/cards/card/components/card-header.component";
import { CardBodyComponent } from "@shared/components/cards/card/components/card-body.component";

@Component({
    selector: 'app-tech-detail-page',
    standalone: true,
    imports: [
        LucideAngularModule,
        CommonModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        BadgeComponent,
        ButtonComponent,
        TechDetailSummaryComponent,
        TechVersionTableSectionComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent
    ],
    templateUrl: './tech-detail-page.component.html'
})
export class TechDetailPageComponent implements OnInit {
    route = inject(ActivatedRoute);
    private router = inject(Router);
    private techState = inject(TechStateService);

    // Icons
    icons = {
        RefreshCw,
        ExternalLink,
        ChevronLeft,
        ChevronRight,
        Info,
        ArrowLeft,
        Layers,
        Code
    };

    readonly categoryBadgeVariant: Record<string, BadgeVariant> = {
        framework: 'primary',
        lang: 'cyan'
    };

    readonly categoryBadgeIcon: Record<string, LucideIconData> = {
        framework: Layers,
        lang: Code
    };

    // State signals
    techDetail = this.techState.techDetail;
    cycles = this.techState.cycles;
    isLoading = this.techState.isLoadingDetail;
    error = this.techState.detailError;
    totalVersions = this.techState.totalVersions;
    activeVersions = this.techState.activeVersionsCount;
    latestVersion = computed(() => {
        const cycles = this.cycles();
        return cycles.length > 0 ? cycles[0].latest : '-';
    });

    showSkeleton = signal(false);
    private readonly MIN_SKELETON_MS = 700;

    // Métodos helper
    getVersionStatus = getVersionStatus;
    formatDate = formatDate;

    async ngOnInit() {
        const techName = this.route.snapshot.paramMap.get('name');
        const label = this.route.snapshot.queryParamMap.get('label') || techName;
        const category = this.route.snapshot.queryParamMap.get('category') as 'framework' | 'lang' || 'framework';

        if (techName) {
            const previousTechName = this.techState.selectedTechName();
            const isSameTech = previousTechName === techName;
            const hasCache = this.cycles().length > 0;

            if (!isSameTech) {
                // Cambió la tecnología - resetear datos y mostrar skeleton siempre
                this.techState.resetDetailData();
                this.showSkeleton.set(true);
            } else if (!hasCache) {
                // Misma tecnología pero sin datos - mostrar skeleton
                this.showSkeleton.set(true);
            }

            const start = Date.now();
            await this.techState.loadTechDetail(techName, label || techName, category);
            
            if (!isSameTech || !hasCache) {
                // Si cambió tech o no hay datos, asegurar que el skeleton cumpla el tiempo mínimo
                const elapsed = Date.now() - start;
                const remaining = this.MIN_SKELETON_MS - elapsed;
                if (remaining > 0) {
                    await new Promise(resolve => setTimeout(resolve, remaining));
                }
            }
            
            this.showSkeleton.set(false);
        } else {
            this.router.navigate(['/technologies']);
        }
    }

    async refresh() {
        const name = this.techState.selectedTechName();
        const detail = this.techDetail();
        if (name && detail) {
            await this.techState.loadTechDetail(name, detail.label, detail.category);
        }
    }

    goToEndOfLife() {
        const detail = this.techDetail();
        if (detail) {
            window.open(detail.endOfLifeLink, '_blank');
        }
    }

    goBack() {
        this.router.navigate(['/technologies']);
    }
}
