// ⚠️ Crear sorteo: 'giveAwayDate' con A mayúscula
export interface CreateGiveawayRequest {
    giveAwayDate: string;
    trStartDate: string;
    trEndDate: string;
    description: string;
    awards: Array<{
        awardId: number;
        winnersQuant: number;
    }>;
}

// ⚠️ Actualizar sorteo: 'giveawayDate' con a minúscula. NO modifica premios.
export interface UpdateGiveawayRequest {
    giveawayDate: string;
    trStartDate: string;
    trEndDate: string;
    description: string;
}
