export interface RunGiveawayResponse {
    giveawayId: number;
    giveAwayDate: string;
    totalWinners: number;
    winnersByAward: Array<{
        awardId: number;
        awardName: string;
        winnersQuant: number;
        winners: Array<{
            clientId: number;
            clientCode: string;
            clientName: string;
        }>;
    }>;
}

export interface CreateGiveawayResponse {
    giveawayId: number;
    giveAwayDate: string;
    trStartDate: string;
    trEndDate: string;
    totalAwards: number;
}
