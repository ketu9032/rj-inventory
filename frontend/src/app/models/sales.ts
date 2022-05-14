export interface ISalesData {
    id: number, user_id: number, description: string, amount: number, date: string, category_id: number
}
export interface ISalesParams {
    id?: number, userId: number, description: string, amount: number, date: string, categoryId: number
}
export interface ISalesActiveParams {
    id: number, status: boolean
}
