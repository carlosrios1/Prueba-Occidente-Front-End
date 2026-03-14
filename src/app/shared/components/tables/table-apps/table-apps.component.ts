import { Component, Input, signal } from '@angular/core';
import { Edit, Ellipsis, Pause, PauseCircle, Play, PlayCircle, Search, Trash, TriangleAlert, LucideAngularModule, CircleCheck, Users, Layers } from 'lucide-angular';
import { App } from '../../../../core/models/entities/app.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from "../../badge/badge.component";

@Component({
  selector: 'app-table-apps',
  standalone: true,
  imports: [RouterLink, CommonModule, LucideAngularModule, BadgeComponent],
  templateUrl: './table-apps.component.html'
})
export class TableAppsComponent {
  readonly ellipsis = Ellipsis;
  readonly play = Play;
  readonly pause = Pause;
  readonly edit = Edit;
  readonly trash = Trash;
  readonly search = Search;
  openDropdownId = signal<string | null>(null);
  @Input() apps!: App[];
  @Input() editable = signal(true);

  readonly tableHeaders: string[] =
    [
      'ID',
      'Nombre',
      'Descripción',
      'Tipo',
      'Tecnología',
      'Equipo',
      'Ambientes',
      'Estado'
    ];

  readonly icons = {
    CircleCheck,
    TriangleAlert,
    Users,
    Layers
  }

  ngOnInit() {
    this.apps = [
      {
        appId: 1,
        nombre: 'Compras Web API',
        descripcion: 'Aplicación de ejemplo número uno que gestiona usuarios y roles dentro de una organización, permitiendo la administración de permisos y auditoría de acciones.',
        tipoAplicacion: 'API',
        tecnologia: 'Angular 17',
        repositorio: 'https://github.com/ejemplo/app-uno',
        fechaCreacion: new Date('2023-01-15T10:30:00Z').toISOString(),
        activa: 1,
        responsables: 4,
        ambientes: 3
      },
      {
        appId: 2,
        nombre: 'Compras Frontend',
        descripcion: 'Aplicación móvil para la gestión de inventarios en tiempo real, con sincronización offline y notificaciones push para alertas de stock bajo.',
        tipoAplicacion: 'Frontend',
        tecnologia: 'Flutter 3',
        repositorio: 'https://github.com/ejemplo/app-dos',
        fechaCreacion: new Date('2022-11-20T08:15:00Z').toISOString(),
        activa: 0,
        responsables: 3,
        ambientes: 2
      },
      {
        appId: 3,
        nombre: 'Gestor de Tareas Backend',
        descripcion: 'API RESTful para procesamiento de pagos, integración con múltiples pasarelas y manejo de transacciones seguras con logs detallados.',
        tipoAplicacion: 'API',
        tecnologia: 'Node.js 18',
        repositorio: 'https://github.com/ejemplo/app-tres',
        fechaCreacion: new Date('2023-03-05T14:45:00Z').toISOString(),
        activa: 1,
        responsables: 2,
        ambientes: 4
      }
    ];
  }
}
