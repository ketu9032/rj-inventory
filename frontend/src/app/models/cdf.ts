
export interface ICdfData {
  id: number, email: string, name: string, company: string, date: string, reference: string, reference_person: string, brands: string, display_names: string, platforms: string,
  other: string,mobile: number, address: string
}


export interface ICdfParams {
    id?: number, email: string, name: string, company: string, date: string, reference: string, referencePerson: string, brands: string, displayNames: string, platforms: string, other: string,mobile: number, address: string
}

export interface ICdfActiveParams {
    id: number, status: boolean
}
