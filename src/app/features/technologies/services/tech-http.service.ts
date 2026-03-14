import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, forkJoin, map } from 'rxjs';
import { GetAllTechsRequest } from '../models/requests/get-all-techs.request';
import { GetAllTechsResponse } from '../models/responses/get-all-techs.response';
import { TechSummaryDto } from '../models/dtos/tech-environment.dto';
import { TechCycleDto, TechDetailDto } from '../models/dtos/tech-detail.dto';

interface EndOfLifeProduct {
    name: string;
    label: string;
}

interface EndOfLifeResponse {
    result: EndOfLifeProduct[];
}

export interface AvailableProduct {
    name: string;
    label: string;
    category: 'framework' | 'lang';
}

@Injectable({
    providedIn: 'root'
})
export class TechHttpService {
    private http = inject(HttpClient);

    // Mock data
    private mockTechList: TechSummaryDto[] = [
        {
            id: 1,
            name: 'Angular',
            label: 'Angular',
            category: 'framework',
            versions: { activeQty: 3, totalQty: 5 },
            description: 'Entorno para desarrollo',
            appsQty: 10,
            servers: 5,
            isActive: true,
            deletion: { possible: false, linkedServersCount: 6 }
        },
        {
            id: 2,
            name: '.NET Core',
            label: '.NET Core',
            category: 'framework',
            versions: { activeQty: 4, totalQty: 6 },
            description: 'Entorno para producción',
            appsQty: 10,
            servers: 5,
            isActive: true,
            deletion: { possible: true, linkedServersCount: 0 }
        },
        {
            id: 3,
            name: 'Python',
            label: 'Python',
            category: 'lang',
            versions: { activeQty: 4, totalQty: 6 },
            description: 'Entorno para producción',
            appsQty: 10,
            servers: 5,
            isActive: true,
            deletion: { possible: true, linkedServersCount: 0 }
        }
    ];

    // =========================
    // OBTENER INFORMACIÓN
    // =========================
    getAllTechs(request: GetAllTechsRequest): Observable<GetAllTechsResponse> {
        // SIMULACIÓN - Comentar esto cuando se conecte al API real
        return this.simulateGetAllTechs(request);

        // PRODUCCIÓN - Descomentar cuando se conecte al API real
        /*
        let httpParams = new HttpParams()
            .set('pagina', request.pagina)
            .set('cantidadPagina', request.cantidadPagina);

        if (request.nombre) {
            httpParams = httpParams.set('nombre', request.nombre);
        }

        if (request.fabricante) {
            httpParams = httpParams.set('fabricante', request.fabricante);
        }

        if (request.tipoId) {
            httpParams = httpParams.set('tipoId', request.tipoId);
        }

        return this.http.get<GetAllOperatingSystemsResponse>(
            `${environment.apiBaseUrl}/operating-systems/GetAllOperatingSystems`,
            {
                params: httpParams,
            }
        );
        */
    }



    getTechsFromEndOfLife(): Observable<AvailableProduct[]> {
        const frameworks$ = this.http.get<EndOfLifeResponse>(
            'https://endoflife.date/api/v1/categories/framework'
        );

        const langs$ = this.http.get<EndOfLifeResponse>(
            'https://endoflife.date/api/v1/categories/lang'
        );

        return forkJoin([frameworks$, langs$]).pipe(
            map(([frameworksData, langsData]) => {
                // Mapear frameworks
                const frameworks = (frameworksData.result || []).map(p => ({
                    name: p.name,
                    label: p.label,
                    category: 'framework' as const
                }));

                // Mapear lenguajes
                const langs = (langsData.result || []).map(p => ({
                    name: p.name,
                    label: p.label,
                    category: 'lang' as const
                }));

                // Combinar y ordenar alfabéticamente
                return [...frameworks, ...langs]
                    .sort((a, b) => a.label.localeCompare(b.label));
            })
        );
    }

    /**
     * Obtiene los detalles completos de una tecnología desde endoflife.date
     * @param techName - Nombre de la tecnología (slug de endoflife.date)
     */
    getTechDetailFromEndOfLife(techName: string): Observable<TechCycleDto[]> {
        return this.http.get<TechCycleDto[]>(
            `https://endoflife.date/api/${techName}.json`
        );
    }

    // =========================
    // MÉTODO DE SIMULACIÓN
    // =========================
    private simulateGetAllTechs(request: GetAllTechsRequest): Observable<GetAllTechsResponse> {
        // Filtrar datos según los criterios de búsqueda
        let filteredData = [...this.mockTechList];

        if (request.nombre) {
            filteredData = filteredData.filter(os =>
                os.name.toLowerCase().includes(request.nombre!.toLowerCase())
            );
        }


        // Paginación
        const totalElementos = filteredData.length;
        const startIndex = (request.pagina - 1) * request.cantidadPagina;
        const endIndex = startIndex + request.cantidadPagina;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        // Simular respuesta del servidor
        const mockResponse: GetAllTechsResponse = {
            success: true,
            status: 200,
            data: {
                pagina: request.pagina,
                totalElementos: totalElementos,
                elementos: paginatedData,
                itemsPagina: request.cantidadPagina
            },
            message: 'Dev environments retrieved successfully'
        };

        // Simular delay de red (500ms)
        return of(mockResponse).pipe(delay(500));
    }

    private getNextId(): number {
        if (this.mockTechList.length === 0) {
            return 1;
        }
        // Encontrar el ID más alto y sumar 1
        return Math.max(...this.mockTechList.map(os => os.id)) + 1;
    }

    // =========================
    // CREAR SISTEMA OPERATIVO
    // =========================
    createTech(data: any): Observable<any> {
        // SIMULACIÓN
        const newTech: TechSummaryDto = {
            id: this.getNextId(),  // ✅ Usa el ID correcto
            name: data.name,
            label: data.label,
            category: "framework",
            versions: { activeQty: 10, totalQty: 10 },
            description: data.description,
            appsQty: 0,
            servers: 0,
            isActive: true,
            deletion: { possible: true, linkedServersCount: 0 }
        };

        this.mockTechList.push(newTech);

        return of({
            success: true,
            status: 201,
            data: newTech,
            message: 'Operating system created successfully'
        }).pipe(delay(500));

        // PRODUCCIÓN - Descomentar cuando se conecte al API real
        /*
        return this.http.post<any>(
            `${environment.apiBaseUrl}/operating-systems`,
            data
        );
        */
    }

    // =========================
    // ACTUALIZAR SISTEMA OPERATIVO
    // =========================
    updateTech(id: number, data: any): Observable<any> {
        // SIMULACIÓN
        const index = this.mockTechList.findIndex(tech => tech.id === id);
        if (index !== -1) {
            this.mockTechList[index] = { ...this.mockTechList[index], ...data };
        }

        return of({
            success: true,
            status: 200,
            data: this.mockTechList[index],
            message: 'Technology updated successfully'
        }).pipe(delay(500));

        // PRODUCCIÓN - Descomentar cuando se conecte al API real
        /*
        return this.http.put<any>(
            `${environment.apiBaseUrl}/operating-systems/${id}`,
            data
        );
        */
    }

    // =========================
    // ELIMINAR SISTEMA OPERATIVO
    // =========================
    deleteTech(id: number): Observable<any> {
        // SIMULACIÓN
        const index = this.mockTechList.findIndex(tech => tech.id === id);
        if (index !== -1) {
            this.mockTechList.splice(index, 1);
        }

        return of({
            success: true,
            status: 200,
            data: null,
            message: 'Operating system deleted successfully'
        }).pipe(delay(500));

        // PRODUCCIÓN - Descomentar cuando se conecte al API real
        /*
        return this.http.delete<any>(
            `${environment.apiBaseUrl}/operating-systems/${id}`
        );
        */
    }
}