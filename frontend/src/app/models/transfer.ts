export interface ITransferData {
    transferId: number, toUserId: number, description: string, amount: number, transferDate: string, isDeleted: boolean, toUserName: string, fromUserId: number, fromUserName: string, isApproved: boolean, isActive: boolean
}
export interface ITransferParams {
    transferId?: number, toUserId: number, description: string, amount: number, transferDate: string, fromUserId: number
}
export interface ITransferActiveParams {
    transferId: number, status: boolean
}
