export interface OperatingSystemSummaryDto {
    id: number;
    name: string;
    /** Slug para endoflife.date (ej: "ubuntu", "windows-server"). Si no está, se usa `name`. */
    eolSlug?: string;
    version: string;
    architecture: string;
    manufacturer: string;
    type: {
        id: number;
        name: string;
    };
    deletion: {
        possible: boolean;
        linkedServersCount: number;
    };
}