export interface Lot {
    id: number;
    fileName: string;
    uploadDate: string;
    totalRecords: number;
    status: 'PENDING' | 'COMPLETED';
    uploadedBy: string;
    transactions: any[];
}
