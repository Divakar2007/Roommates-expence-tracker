import React, { useState, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AddRoommateModal } from './components/AddRoommateModal';
import { Header } from './components/Header';
import { User, Expense } from './types';
import { INITIAL_USERS, INITIAL_EXPENSES } from './constants';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isAddRoommateModalOpen, setIsAddRoommateModalOpen] = useState(false);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(prevExpenses => [
      { ...expense, id: `exp-${Date.now()}` },
      ...prevExpenses,
    ]);
    setIsExpenseModalOpen(false);
  };

  const addRoommate = (name: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setIsAddRoommateModalOpen(false);
  };


  const balances = useMemo(() => {
    const userBalances: { [key: string]: number } = {};
    users.forEach(user => userBalances[user.id] = 0);

    expenses.forEach(expense => {
      const amount = expense.amount;
      const paidById = expense.paidBy;
      const splitAmong = expense.splitWith;
      const share = amount / splitAmong.length;

      // The payer gets credited the full amount
      userBalances[paidById] += amount;

      // Each person in the split owes their share
      splitAmong.forEach(userId => {
        userBalances[userId] -= share;
      });
    });

    return users.map(user => ({
      ...user,
      balance: userBalances[user.id],
    }));
  }, [users, expenses]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header onAddExpense={() => setIsExpenseModalOpen(true)} />
      <main className="container mx-auto p-4 md:p-6">
        <Dashboard
          usersWithBalances={balances}
          expenses={expenses}
          users={users}
          onAddRoommate={() => setIsAddRoommateModalOpen(true)}
        />
      </main>
      {isExpenseModalOpen && (
        <AddExpenseModal
          users={users}
          onAddExpense={addExpense}
          onClose={() => setIsExpenseModalOpen(false)}
        />
      )}
      {isAddRoommateModalOpen && (
        <AddRoommateModal
          onAddRoommate={addRoommate}
          onClose={() => setIsAddRoommateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;