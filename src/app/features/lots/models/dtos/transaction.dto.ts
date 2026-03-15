export interface Transaction {
    id: number;
    clientCode: string;
    clientName: string;
    lotId: number;
    transactionDate: string;
    amount: number;
    currency: string;
    description: string;
    authNumber: string;
}
