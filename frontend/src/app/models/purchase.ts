export interface IPurchaseData {
    [x: string]: any
    id: number, date: string,  qty: number, amount: number, total_due: number, user_id: string,  remarks: string, suppliers_id: number, payment: number, other_payment: number, pending_due: number, grand_total: number
}
export interface IPurchaseParams {
    id?: number,   total_due: number, user_id: number, remarks: string, sales: {}, suppliers_id: number, payment: number, other_payment?: number, pending_due: number, grand_total: number
}
export interface IPurchaseActiveParams {
    id: number, status: boolean
}


