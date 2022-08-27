export interface ITransferData {
    transferId: number, toUserId: number, description: string, amount: number, isDeleted: boolean, toUserName: string, fromUserId: number, fromUserName: string, isApproved: boolean, isActive: boolean
}
export interface ITransferParams {
    transferId?: number, toUserId: number, description: string, amount: number, fromUserId: number
}
export interface ITransferActiveParams {
    transferId: number, status: boolean
}
