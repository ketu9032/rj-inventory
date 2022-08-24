export interface IPurchaseData {
    id: number, date: string, invoice_no: number, qty: number, amount: number, total_due: number, user_name: string, tier: string, remarks: string, customer: string, payment: number, other_payment: number, pending_due: number, grand_total: number, amount_pd_total: number
}
export interface IPurchaseParams {
    id?: number, invoice_no: number, qty: number, amount: number, total_due: number, user_name: string, tier: string, remarks: string, sales: {}, customer: string, payment: number, other_payment?: number, pending_due: number, grand_total: number, amount_pd_total: number
}

export interface ISalesActiveParams {
    id: number, status: boolean
}


