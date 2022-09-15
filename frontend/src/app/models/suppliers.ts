
export interface ISuppliersData {
    id: number, company: string, due_limit: number, balance: number, other: string
}

export interface ISuppliersParams {
    id?: number, company: string, dueLimit: number, balance: number, other: string
}
export interface ISuppliersActiveParams {
    id: number, status: boolean
}

export interface ISupplierCompany {
    company: string;
}
