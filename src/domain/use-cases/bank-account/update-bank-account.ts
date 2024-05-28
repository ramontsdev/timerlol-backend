import { BankAccount } from '../../models/bank-account';

import { BankAccountDTO } from './create-bank-account';

export interface IUpdateBankAccount {
  update(bankAccountId: string, bankAccountDTO: BankAccountDTO): Promise<BankAccount>;
}
