import { useMemo, useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { CITY_IMAGES, EXPENSE_CATEGORIES, TIMELINE } from '../data/content';
import { computeSplit } from '../utils/expenseSplit';
import {
  addExpense,
  deleteExpense,
  formatUsd,
  getExpenses,
  getMembers,
  saveMembers,
  type Expense,
} from '../utils/expenseStorage';

type Tab = 'add' | 'list' | 'settle';

export function ExpensesPage() {
  const [tab, setTab] = useState<Tab>('add');
  const [members, setMembers] = useState(() => getMembers());
  const [expenses, setExpenses] = useState(() => getExpenses());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(() => getMembers()[0] ?? '');
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [dayId, setDayId] = useState('');
  const [editingMembers, setEditingMembers] = useState(false);
  const [memberDraft, setMemberDraft] = useState('');

  const split = useMemo(() => computeSplit(members, expenses), [members, expenses]);

  const refresh = () => {
    setMembers(getMembers());
    setExpenses(getExpenses());
  };

  const handleAdd = () => {
    const value = Number.parseFloat(amount);
    if (!description.trim() || !Number.isFinite(value) || value <= 0 || !paidBy) return;
    addExpense({
      description: description.trim(),
      amount: Math.round(value * 100) / 100,
      paidBy,
      category,
      dayId: dayId || undefined,
    });
    setDescription('');
    setAmount('');
    refresh();
    setTab('list');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this expense?')) return;
    deleteExpense(id);
    refresh();
  };

  const handleSaveMembers = () => {
    const names = memberDraft
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (names.length === 0) return;
    saveMembers(names);
    setEditingMembers(false);
    if (!names.includes(paidBy)) setPaidBy(names[0]);
    refresh();
  };

  const openMemberEdit = () => {
    setMemberDraft(members.join(', '));
    setEditingMembers(true);
  };

  return (
    <>
      <HeroBanner
        title="Trip Expenses"
        subtitle="Track who paid · split equally at the end"
        image={CITY_IMAGES.boston}
        theme="boston"
        badge={split.total > 0 ? formatUsd(split.total) : 'No expenses yet'}
      />

      <div className="tabs">
        <button type="button" className={`tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
          Add
        </button>
        <button type="button" className={`tab ${tab === 'list' ? 'active' : ''}`} onClick={() => setTab('list')}>
          List ({expenses.length})
        </button>
        <button type="button" className={`tab ${tab === 'settle' ? 'active' : ''}`} onClick={() => setTab('settle')}>
          Settle up
        </button>
      </div>

      <div className="card card-compact">
        <div className="expense-members-head">
          <h2>Travelers ({members.length})</h2>
          <button type="button" className="btn" onClick={openMemberEdit}>
            Edit names
          </button>
        </div>
        <p className="expense-members-list">{members.join(' · ')}</p>
        {editingMembers && (
          <div className="expense-member-edit">
            <label className="currency-label">
              Names (comma-separated)
              <textarea
                className="expense-textarea"
                value={memberDraft}
                onChange={(e) => setMemberDraft(e.target.value)}
                rows={2}
              />
            </label>
            <div className="btn-row">
              <button type="button" className="btn btn-primary" onClick={handleSaveMembers}>
                Save
              </button>
              <button type="button" className="btn" onClick={() => setEditingMembers(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {tab === 'add' && (
        <div className="card">
          <h2>Add expense</h2>
          <label className="currency-label">
            What was it?
            <input
              className="currency-input expense-input-sm"
              type="text"
              placeholder="e.g. Dinner at Regina"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="currency-label">
            Amount (USD)
            <input
              className="currency-input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="currency-label">
            Who paid?
            <select className="expense-select" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {members.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <div className="currency-tip-region">
            {EXPENSE_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`tab ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="currency-label">
            Trip day (optional)
            <select className="expense-select" value={dayId} onChange={(e) => setDayId(e.target.value)}>
              <option value="">—</option>
              {TIMELINE.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.date} — {d.where}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={handleAdd}>
            Save expense
          </button>
        </div>
      )}

      {tab === 'list' && (
        <div className="card">
          <h2>All expenses</h2>
          {expenses.length === 0 ? (
            <p className="page-lead">No expenses logged yet. Add a meal or ticket to get started.</p>
          ) : (
            <ul className="expense-list">
              {expenses.map((e) => (
                <ExpenseRow key={e.id} expense={e} onDelete={() => handleDelete(e.id)} />
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'settle' && (
        <>
          <div className="card">
            <h2>Summary</h2>
            <p className="expense-summary-total">
              Total spent: <strong>{formatUsd(split.total)}</strong>
            </p>
            {split.memberCount > 0 && (
              <p className="page-lead">
                Split {split.memberCount} ways → <strong>{formatUsd(split.fairShare)}</strong> per person
              </p>
            )}
          </div>

          {split.balances.length > 0 && split.total > 0 && (
            <div className="card">
              <h2>Balances</h2>
              <p className="page-lead" style={{ marginBottom: '0.75rem' }}>
                Positive = paid more than their share (owed money). Negative = owes the group.
              </p>
              <ul className="expense-balance-list">
                {split.balances.map((b) => (
                  <li key={b.name} className="expense-balance-row">
                    <div>
                      <strong>{b.name}</strong>
                      <span className="expense-balance-paid">paid {formatUsd(b.paid)}</span>
                    </div>
                    <span className={`expense-balance-net${b.net >= 0 ? ' expense-positive' : ' expense-negative'}`}>
                      {b.net >= 0 ? '+' : ''}
                      {formatUsd(b.net)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <h2>Who pays whom</h2>
            {split.transfers.length === 0 ? (
              <p className="page-lead">
                {split.total === 0
                  ? 'Add expenses first, then come back here to settle up.'
                  : 'All square — no transfers needed!'}
              </p>
            ) : (
              <ul className="expense-transfer-list">
                {split.transfers.map((t, i) => (
                  <li key={`${t.from}-${t.to}-${i}`} className="expense-transfer-row">
                    <strong>{t.from}</strong>
                    <span> pays </span>
                    <strong>{t.to}</strong>
                    <span className="expense-transfer-amt">{formatUsd(t.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
}

function ExpenseRow({ expense, onDelete }: { expense: Expense; onDelete: () => void }) {
  const day = expense.dayId ? TIMELINE.find((d) => d.id === expense.dayId) : null;
  return (
    <li className="expense-list-row">
      <div className="expense-list-main">
        <strong>{expense.description}</strong>
        <span className="expense-list-meta">
          {expense.category} · paid by {expense.paidBy}
          {day ? ` · ${day.date}` : ''}
        </span>
      </div>
      <div className="expense-list-actions">
        <span className="expense-list-amt">{formatUsd(expense.amount)}</span>
        <button type="button" className="btn expense-delete-btn" onClick={onDelete} aria-label="Delete">
          ✕
        </button>
      </div>
    </li>
  );
}
