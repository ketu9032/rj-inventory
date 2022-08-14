
export interface ISalesQuotationData {
    id: number,  company: string, date: string, invoice_no: number, ref_no: number, company_id: number
}

export interface ISalesQuotationParams {
    id?: number, company: string, date: string, invoice_no: number, ref_no: number, sales: {}, companyId: number
}

export interface ISalesQuotationActiveParams {
    id: number, status: boolean
}

