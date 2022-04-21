
export interface IItemData {
    id: number, item_code: string, item_name: string, category: string, comment: string, int_qty: number, silver: number, retail: number, gold: number, india_mart: number, dealer: number, category_id: number
}


export interface IItemParams {
    id?: number, item_code: string, item_name: string, category: string, comment: string, int_qty: number, silver: number, retail: number, gold: number, india_mart: number, dealer: number, suppliers: {}[], categoryId: number,
}

export interface IItemActiveParams {
    id: number, status: boolean
}
