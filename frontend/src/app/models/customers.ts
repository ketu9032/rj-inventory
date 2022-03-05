
export interface ICustomersData {
  id: number, company: string, first_name: string, address: string, email: string, mobile_no: string, due_limit: string, balance: number, other: string, tier_name: string, tier_id: number
}

export interface ICustomersParams {
  id?: number, company: string, firstName: string, address: string, email: string, mobileNumber: string, dueLimit: string, balance: number, other: string, tierId: number
}