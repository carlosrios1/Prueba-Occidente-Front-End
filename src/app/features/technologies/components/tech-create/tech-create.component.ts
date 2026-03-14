import { Component, inject, signal } from '@angular/core';
import { TechData, TechFormComponent } from '../tech-form/tech-form.component';
import { TechMapper } from '../../utils/tech.mapper';
import { TechStateService } from '../../services/tech-state.service';

@Component({
    selector: 'app-tech-create',
    standalone: true,
    imports: [TechFormComponent],
    templateUrl: './tech-create.component.html'
})
export class TechCreateComponent {
    techState = inject(TechStateService);

    protected isCreating = signal<boolean>(false);

    ngOnInit() {
        const hasData = this.techState.products().length > 0;
        const cacheIsValid = this.techState.isCacheValid(); // Exponer como computed
        console.log('Cache is valid:', cacheIsValid);
        console.log('Products loaded:', this.techState.products());
        if (!hasData) {
            // Primera carga
            this.techState.loadProductos();
        } else if (!cacheIsValid) {
            // Hay datos pero están viejos, actualizar en background
            this.techState.loadProductos();
        }
        // Si hay datos Y el cache es válido → no hacer nada
    }

    async handleCreate(data: TechData): Promise<void> {
        this.isCreating.set(true);

        // Convertir datos del formulario al formato del API
        // Para CREATE no necesitamos el segundo parámetro (originalDto)
        const createData = TechMapper.fromFormData(data);

        const success = await this.techState.createTech(createData);

        this.isCreating.set(false);

        if (success) {
            console.log('Tecnología creada correctamente');
            // El modal se cerrará automáticamente cuando isCreating pase a false
        } else {
            console.error('Error al crear tecnología');
        }
    }
}