
export interface ICustomersData {
  id: number, company: string, firstName: string, address: string, email: string, mobileNumber: string, dueLImit: string, balance: number, other: string, tier: string
}

export interface ICustomersParams {
  id?: number, company: string, firstName: string, address: string, email: string, mobileNumber: string, dueLImit: string, balance: number, other: string, tier: string
}