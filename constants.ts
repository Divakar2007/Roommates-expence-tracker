import { User, Expense, Category } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Alex' },
  { id: 'user-2', name: 'Bella' },
  { id: 'user-3', name: 'Chris' },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    description: 'Monthly Rent',
    amount: 1200,
    category: Category.Rent,
    date: '2024-07-01',
    paidBy: 'user-1',
    splitWith: ['user-1', 'user-2', 'user-3'],
  },
  {
    id: 'exp-2',
    description: 'Grocery Shopping',
    amount: 150.75,
    category: Category.Groceries,
    date: '2024-07-10',
    paidBy: 'user-2',
    splitWith: ['user-1', 'user-2', 'user-3'],
  },
  {
    id: 'exp-3',
    description: 'Electricity Bill',
    amount: 85.50,
    category: Category.Utilities,
    date: '2024-07-12',
    paidBy: 'user-3',
    splitWith: ['user-1', 'user-2', 'user-3'],
  },
    {
    id: 'exp-4',
    description: 'Movie Tickets',
    amount: 45.00,
    category: Category.Entertainment,
    date: '2024-07-15',
    paidBy: 'user-1',
    splitWith: ['user-1', 'user-2'],
  },
];