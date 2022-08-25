export interface IPurchaseData {
    [x: string]: any
    id: number, date: string, invoice_no: number, qty: number, amount: number, total_due: number, user_name: string,  remarks: string, supplier: string, payment: number, other_payment: number, pending_due: number, grand_total: number, amount_pd_total: number
}
export interface IPurchaseParams {
    id?: number, invoice_no: number, qty: number, amount: number, total_due: number, user_name: string, remarks: string, sales: {}, supplier: string, payment: number, other_payment?: number, pending_due: number, grand_total: number, amount_pd_total: number
}

export interface IPurchaseActiveParams {
    id: number, status: boolean
}


