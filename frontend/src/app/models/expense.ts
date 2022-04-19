
export interface IExpenseData {
    id: number, user_id: number, description: string, amount: number, date: string, category_id: number

}

export interface IExpenseParams {
    id?: number, userId: number, description: string, amount: number, date: string, categoryId: number

}
export interface IExpenseActiveParams {
    id: number, status: boolean
}
