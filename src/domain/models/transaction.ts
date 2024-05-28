export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'paidOut' | 'pending';

export type Transaction = {
  id: string;
  bankAccountId: string;
  categoryId: string | null;
  userId: string;
  name: string;
  value: number;
  date: Date;
  type: TransactionType;
  status: TransactionStatus | null;
};
