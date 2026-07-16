export interface MasterBanksType {
    id: number;
    name: string;
    logo: string;
}

export interface BanksType {
    account_name: string;
    account_number: string;
    business_id: number;
    id: number;
    is_active: boolean;
    master_bank: MasterBanksType
    master_bank_id: number;
}
