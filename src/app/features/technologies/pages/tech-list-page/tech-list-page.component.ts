import { Component } from '@angular/core';
import {
    LucideAngularModule,
} from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBodyLayoutComponent } from "../../../../shared/components/page-body-layout/page-body-layout.component";
import { PageHeaderComponent } from "../../../../shared/components/header/app-page-header-component";
import { TechCreateComponent } from "../../components/tech-create/tech-create.component";
import { TechListComponent } from '../../components/tech-list/tech-list.component';
import { PaginationService } from '@shared/pagination.service';

@Component({
    selector: 'app-tech-list-page',
    standalone: true,
    imports: [
        LucideAngularModule,
        CommonModule,
        FormsModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        TechListComponent,
        TechCreateComponent
    ],
    providers: [PaginationService],
    templateUrl: './tech-list-page.component.html'
})
export class TechListPageComponent {
}