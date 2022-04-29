
export interface ICustomersData {
  id: number, company: string, name: string, address: string, email: string, mobile: string, due_limit: string, balance: number, other: string, tier_name: string, tier_id: number
}

export interface ICustomersParams {
  id?: number, company: string, name: string, address: string, email: string, mobile: string, dueLimit: string, balance: number, other: string, tierId: number
}

export interface ICustomersActiveParams {
    id: number, status: boolean
}
