
export interface IExpenseData {
    id: number, user_id: number, description: string, amount: number, date: string, category_id: number

}

export interface IExpenseParams {
    id?: number, description: string, amount: number, categoryId: number, isCashIn: boolean

}
export interface IExpenseActiveParams {
    id: number, status: boolean
}
