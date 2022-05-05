export interface ICdfData {
    id: number, email: string, name: string, company: string, date: string, reference: string, reference_person: string, brands: string, display_names: string, platforms: string,
    other: string, mobile: number, address: string,
    due_limit: string, balance: number, tier_name: string, tier_id: number
}
export interface ICdfParams {
    id?: number, email: string, name: string, company: string, date: string, reference: string, referencePerson: string, brands: string, displayNames: string, platforms: string, other: string, mobile: number, address: string,
}
export interface ICdfToCustomersParams {
    id?: number, email: string, name: string, company: string, date: string, reference: string, referencePerson: string, brands: string, displayNames: string, platforms: string, other: string, mobile: number, address: string, dueLimit: string, balance: number, tierId: number
}
export interface ICdfActiveParams {
    id: number, status: boolean
}
export interface ICdfStatusActiveParams {
    id: number,
    cdfStatus: string
}
export interface Brand {
    name: string;
}
export interface ICdfEmail {
    email: string;
}
export interface ICdfMobile {
    mobile: number;
}
export interface ICdfCompany {
    company: string;
}
