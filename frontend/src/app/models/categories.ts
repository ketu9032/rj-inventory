
export interface ICategoriesData {
  id: number, code: string, name: string
}

export interface ICategoriesParams {
  id?: number, code: string, name: string
}

export interface ICategoriesActiveParams {
    id: number, status: boolean
}
