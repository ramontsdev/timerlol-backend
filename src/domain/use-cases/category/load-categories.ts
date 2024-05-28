import { Category } from '../../models/category';

export interface ILoadCategories {
  loadAll(userId: string): Promise<Category[]>;
}
