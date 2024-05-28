import { BankAccount } from '../../models/bank-account';

export interface ILoadBankAccounts {
  load(userId: string): Promise<BankAccount[]>;
}
