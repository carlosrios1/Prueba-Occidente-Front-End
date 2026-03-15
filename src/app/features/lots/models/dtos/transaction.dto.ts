export interface Transaction {
    id: number;
    clientCode: string;
    clientName: string;
    loteId: number;
    transactionDate: string;
    amount: number;
    currency: string;
    description: string;
    authNumber: string;
}
