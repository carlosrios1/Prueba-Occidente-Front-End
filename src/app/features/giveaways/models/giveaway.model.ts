export interface GiveawayAward {
    id: number;
    awardId: number;
    awardName: string;
    winnersQuant: number;
}

export interface GiveawaySummary {
    id: number;
    giveawayDate: string;
    trStartDate: string;
    trEndDate: string;
    description: string;
}

export interface GiveawayDetail extends GiveawaySummary {
    awards: GiveawayAward[];
}

export interface WinnerRecord {
    clientCode: string;
    clientName: string;
    awardName: string;
    giveawayDate: string;
}
