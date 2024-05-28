import { Transaction } from '../../models/transaction';

export type TransactionDTO = Omit<Transaction, 'id'>;

export interface ICreateTransaction {
  create(transactionDTO: TransactionDTO): Promise<Transaction>;
}
