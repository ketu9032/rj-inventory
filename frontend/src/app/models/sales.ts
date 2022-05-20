export interface ISalesData {
    id: number, item_code: string, qty: number, available:number,  selling_price: number, total: number}

export interface ISalesParams {
    id?: number,item_code: string, qty: number, available:number,  selling_price: number, total: number

}
export interface ISalesActiveParams {
    id: number, status: boolean
}
