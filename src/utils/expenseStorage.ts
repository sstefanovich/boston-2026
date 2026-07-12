import { TRIP_MEMBERS } from '../data/content';

const EXPENSES_KEY = 'boston-travel-expenses-v1';
const MEMBERS_KEY = 'boston-travel-members-v1';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  category: string;
  dayId?: string;
  createdAt: number;
}

function newId(): string {
  return `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getMembers(): string[] {
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (!raw) return [...TRIP_MEMBERS];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...TRIP_MEMBERS];
  } catch {
    return [...TRIP_MEMBERS];
  }
}

export function saveMembers(members: string[]): void {
  const cleaned = members.map((m) => m.trim()).filter(Boolean);
  if (cleaned.length === 0) return;
  try {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(cleaned));
  } catch {
    /* ignore */
  }
}

export function getExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Expense[];
    return Array.isArray(list) ? list.sort((a, b) => b.createdAt - a.createdAt) : [];
  } catch {
    return [];
  }
}

function persist(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch {
    /* ignore */
  }
}

export function addExpense(input: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const expense: Expense = {
    ...input,
    id: newId(),
    createdAt: Date.now(),
  };
  const next = [expense, ...getExpenses()];
  persist(next);
  return expense;
}

export function deleteExpense(id: string): void {
  persist(getExpenses().filter((e) => e.id !== id));
}

export function clearExpenses(): void {
  try {
    localStorage.removeItem(EXPENSES_KEY);
  } catch {
    /* ignore */
  }
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
