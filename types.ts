export enum Category {
  Rent = 'Rent',
  Groceries = 'Groceries',
  Utilities = 'Utilities',
  Entertainment = 'Entertainment',
  Other = 'Other',
}

export interface User {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  paidBy: string; // User ID
  splitWith: string[]; // Array of User IDs
}