export interface ISalesData {
    id: number,  date: string, invoice_no:number, ref_no:number,   company_id:number}

export interface ISalesParams {
    id?: number,  date: string, invoice_no:number, ref_no:number, sales: {}, companyId:number

}
export interface ISalesActiveParams {
    id: number, status: boolean
}


