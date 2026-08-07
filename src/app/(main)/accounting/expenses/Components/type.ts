export interface ExpensesType {
    id: number;
    business_id: number;
    outlet_id: number | null;
    category: string;
    amount: number;
    expense_date: string;
    notes: string | null;
    outlet?: {
        id: number;
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface ExpenseForm {
    outlet_id: string;
    category: string;
    amount: string;
    expense_date: string;
    notes: string;
}