export interface ProfitLossSummary {
    omzet: number;
    total_discount: number;
    total_hpp: number;
    laba_kotor: number;
    total_pengeluaran: number;
    laba_bersih: number;
}

export interface ProfitLossResponse {
    periode: {
        start: string;
        end: string;
    };
    ringkasan: ProfitLossSummary;
}