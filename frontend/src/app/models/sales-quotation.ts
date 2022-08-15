
export interface ISalesQuotationData {
    id: number,  date: string, invoice_no: number, qty: number, amount: number,    total_due: number, user_name: string, tier: string, remarks: string

}

export interface ISalesQuotationParams {
    id?: number,  date: string, invoice_no: number,   qty: number, amount: number, total_due: number, user_name: string, tier: string, remarks: string, sales: {}
}

export interface ISalesQuotationActiveParams {
    id: number, status: boolean
}

