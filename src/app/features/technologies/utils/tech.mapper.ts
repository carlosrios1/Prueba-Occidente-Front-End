import { TechData } from '../components/tech-form/tech-form.component';
import { TechSummaryDto } from '../models/dtos/tech-environment.dto';

export class TechMapper {
    static toFormData(dto: TechSummaryDto): TechData {
        return {
            name: dto.name,
            label: dto.label,
            category: dto.category,
        };
    }

    /**
     * Convierte datos de formulario a estructura para actualización o creación
     * @param formData - Datos del formulario
     * @param originalDto - DTO original (solo necesario en UPDATE para preservar datos)
     */
    static fromFormData(
        formData: TechData,
        originalDto?: TechSummaryDto
    ): Partial<TechSummaryDto> {
        return {
            name: formData.name,
            label: formData.label,
            category: formData.category,
        };
    }
}