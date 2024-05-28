export interface IDeleteBankAccount {
  delete(bankAccountId: string): Promise<void>;
}
