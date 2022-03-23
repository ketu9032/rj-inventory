
export interface IItemData {
  id: number, itemCode: string, itemName: string,category: string, comment: string, email: string, initQty: number,  silver: number, retail: number, gold: number, indiaMart: number, dealer: number

}

export interface IItemParams {
  id?: number,  itemCode: string, itemName: string, category: string, comment: string, email: string, initQty: number,  silver: number, retail: number, gold: number, indiaMart: number, dealer: number
}

export interface IItemActiveParams {
    id: number, status: boolean
}
