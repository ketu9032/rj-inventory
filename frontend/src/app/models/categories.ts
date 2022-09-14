
export interface ICategoriesData {
    id: number, code: string, name: string
}

export interface ICategoriesParams {
    id?: number, code: string, name: string, type?: string
}

export interface ICategoriesActiveParams {
    id: number, status: boolean
}
export interface ICategoryCode{
    code: string;
}
export interface ICategoryName{
    name: string;
}
