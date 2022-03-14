
export interface ITiersData {
  id: number, code: string, name: string
}

export interface ITiersParams {
  id?: number, code: string, name: string
}

export interface ITiersActiveParams {
    id: number, status: boolean
}
