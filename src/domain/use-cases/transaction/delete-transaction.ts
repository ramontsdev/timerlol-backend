export interface IDeleteTransaction {
  delete(transactionId: string): Promise<void>;
}
