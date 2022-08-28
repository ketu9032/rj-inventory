
export interface IExpenseData {
    expenseId: number, user_id: number, description: string, amount: number, date: string, categoryId: number, isCashIn: boolean

}

export interface IExpenseParams {
    id?: number, description: string, amount: number, categoryId: number, isCashIn: boolean

}
export interface IExpenseActiveParams {
    expenseId: number, status: boolean
}
