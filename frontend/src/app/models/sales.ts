export interface ISalesData {
    id: number, date: string, invoice_no: number, qty: number, amount: number, total_due: number, user_name: string, tier: string, remarks: string, customer_id: number, payment: number, other_payment: number, pending_due: number, grand_total: number, amount_pd_total: number
}
export interface ISalesParams {
    id?: number,   qty: number,bill_no: number, amount: number, total_due: number, user_name: string, tier: string, remarks?: string, sales: {},  customer_id:number, payment: number, other_payment?: number, pending_due: number, grand_total: number, amount_pd_total: number
}
export interface ISalesQuotationToSalesParams {
    id?: number, date: string, invoice_no: number, qty: number, amount: number, total_due: number, user_name: string, tier: string, remarks: string, customer: string, pending_due: number, amount_pd_total: number
}
export interface ICdfUpdateParams {
      qty: number, buyingPrice: number,customer_id:number, payment: number
}
export interface ISalesActiveParams {
    id: number, status: boolean
}


