
export interface ISalesQuotationData {
    id: number, company: string, date: string, invoice_no: number, ref_no: number
}

export interface ISalesQuotationParams {
    id?: number, company: string, date: string, invoice_no: number, ref_no: number, sales: {}
}

export interface ISalesQuotationActiveParams {
    id: number, status: boolean
}

