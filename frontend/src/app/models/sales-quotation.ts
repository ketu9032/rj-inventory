export interface ISalesQuotationData {
    id: number,  date: string, invoice_no: number, qty: number, amount: number,    total_due: number, shipping: number,
    gst: number, user_name: string, tier_id: number, remarks: string
}
export interface ISalesQuotationParams {
    id?: number, qty: number, amount: number, total_due: number,shipping: number,
    gst: number, user_name: string, tier_id: number, remarks: string,sales: {}
}
export interface ISalesQuotationActiveParams {
    id: number, status: boolean
}
