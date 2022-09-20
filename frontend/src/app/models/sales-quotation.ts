export interface ISalesQuotationData {
    id: number,qty: number,  shipping: number, gst: number, user_id: number, tier_id: number, remarks: string
}
export interface ISalesQuotationParams {
    id?: number,qty: number, shipping: number,
    gst: number, user_id: number, tier_id: number, remarks: string,sales: {}
}
export interface ISalesQuotationActiveParams {
    id: number, status: boolean
}
