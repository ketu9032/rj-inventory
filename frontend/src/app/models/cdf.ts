
export interface ICdfData {
  id: number, email: string, firstName: string, company: string, date: string, reference: string, referencePerson: string, listOfBrands: string, listOfDisplayNames: string, ListOfSites: string,
  other: string,mobileNumber: number, address: string,
}

export interface ICdfParams {
    id?: number, email: string, firstName: string, company: string, date: string, reference: string, referencePerson: string, listOfBrands: string, listOfDisplayNames: string, ListOfSites: string,
    other: string,mobileNumber: number, address: string,
}

export interface ICdfActiveParams {
    id: number, status: boolean
}
