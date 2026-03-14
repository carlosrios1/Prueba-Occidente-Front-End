import { TechCycleDto, TechVersionStatus } from '../models/dtos/tech-detail.dto';

/**
 * Determina el estado de una versión basado en su fecha de EOL
 */
export function getVersionStatus(cycle: TechCycleDto): TechVersionStatus {
    const now = new Date();

    // Si eol es false, la versión está activa indefinidamente
    if (cycle.eol === false) {
        return { type: 'active', label: 'Activo', color: 'success' };
    }

    // Si eol es true, la versión está en EOL
    if (cycle.eol === true) {
        return { type: 'eol', label: 'EOL', color: 'error' };
    }

    // Si eol es una fecha
    if (typeof cycle.eol === 'string') {
        const eolDate = new Date(cycle.eol);

        // Versión en EOL
        if (eolDate < now) {
            return { type: 'eol', label: 'EOL', color: 'error' };
        }

        // Versión próxima a EOL (menos de 6 meses)
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

        if (eolDate < sixMonthsFromNow) {
            return { type: 'deprecated', label: 'Deprecado', color: 'warning' };
        }

        // Versión activa
        return { type: 'active', label: 'Activo', color: 'success' };
    }

    // Por defecto, asumir activo
    return { type: 'active', label: 'Activo', color: 'success' };
}

/**
 * Formatea una fecha para mostrar
 */
export function formatDate(date: string | boolean | undefined): string {
    if (!date || typeof date === 'boolean') {
        return '-';
    }

    try {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return '-';
    }
}
