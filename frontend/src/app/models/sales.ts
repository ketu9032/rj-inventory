export interface ISalesData {
    id: number,  date: string, invoice_no: number, qty: number, amount: number,    total_due: number, user_name: string, tier: string, remarks: string, customer: string, payment: number, other_payment:number, last_due: number, grand_total:number
}
export interface ISalesParams {
    id?: number,  date: string, invoice_no: number,   qty: number, amount: number, total_due: number, user_name: string, tier: string, remarks: string,sales: {},customer: string, payment: number, other_payment?: number, last_due: number, grand_total: number
}
export interface ISalesQuotationToSalesParams {
    id?: number,  date: string, invoice_no: number,   qty: number, amount: number, total_due: number, user_name: string, tier: string, remarks: string,customer: string, payment: number
}
export interface ISalesActiveParams {
    id: number, status: boolean
}


