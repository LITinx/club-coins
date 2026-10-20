// Short code a student shows the admin when collecting a reward
export function redemptionCode(transactionId: string) {
  return transactionId.slice(0, 6).toUpperCase()
}
