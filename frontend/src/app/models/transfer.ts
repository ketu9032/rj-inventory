
export interface ITransferData {
  id: number,  user_id: number, description: string, amount: number,  date: string

}

export interface ITransferParams {
  id?: number,  userId: number, description: string, amount: number, date: string

}

export interface ITransferActiveParams {
    id: number, status: boolean
}

