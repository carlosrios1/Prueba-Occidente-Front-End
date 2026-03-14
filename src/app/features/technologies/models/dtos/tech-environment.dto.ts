export interface TechSummaryDto {
    id: number;
    name: string;
    label: string;
    category: string;
    versions: {
        activeQty: number;
        totalQty: number;
    };
    description: string;
    appsQty: number;
    servers: number;
    isActive: boolean;
    deletion: {
        possible: boolean;
        linkedServersCount: number;
    };
}