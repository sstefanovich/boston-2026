import type { Expense } from './expenseStorage';

export interface MemberBalance {
  name: string;
  paid: number;
  fairShare: number;
  /** Positive = others owe them; negative = they owe the group */
  net: number;
}

export interface SettlementTransfer {
  from: string;
  to: string;
  amount: number;
}

export interface SplitSummary {
  total: number;
  fairShare: number;
  memberCount: number;
  balances: MemberBalance[];
  transfers: SettlementTransfer[];
}

export function computeSplit(members: string[], expenses: Expense[]): SplitSummary {
  const memberCount = members.length;
  const total = round2(expenses.reduce((sum, e) => sum + e.amount, 0));
  const fairShare = memberCount > 0 ? round2(total / memberCount) : 0;

  const paidByMember = new Map<string, number>();
  for (const m of members) paidByMember.set(m, 0);
  for (const e of expenses) {
    if (paidByMember.has(e.paidBy)) {
      paidByMember.set(e.paidBy, round2((paidByMember.get(e.paidBy) ?? 0) + e.amount));
    }
  }

  const balances: MemberBalance[] = members.map((name) => {
    const paid = paidByMember.get(name) ?? 0;
    return {
      name,
      paid,
      fairShare,
      net: round2(paid - fairShare),
    };
  });

  const transfers = minimizeTransfers(balances);

  return { total, fairShare, memberCount, balances, transfers };
}

function minimizeTransfers(balances: MemberBalance[]): SettlementTransfer[] {
  const creditors = balances
    .filter((b) => b.net > 0.005)
    .map((b) => ({ name: b.name, amount: b.net }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = balances
    .filter((b) => b.net < -0.005)
    .map((b) => ({ name: b.name, amount: -b.net }))
    .sort((a, b) => b.amount - a.amount);

  const transfers: SettlementTransfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const pay = round2(Math.min(debtors[i].amount, creditors[j].amount));
    if (pay > 0.005) {
      transfers.push({ from: debtors[i].name, to: creditors[j].name, amount: pay });
    }
    debtors[i].amount = round2(debtors[i].amount - pay);
    creditors[j].amount = round2(creditors[j].amount - pay);
    if (debtors[i].amount <= 0.005) i += 1;
    if (creditors[j].amount <= 0.005) j += 1;
  }

  return transfers;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
