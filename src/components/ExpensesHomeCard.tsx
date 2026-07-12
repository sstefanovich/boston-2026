import { Link } from 'react-router-dom';
import { useRefresh } from '../context/RefreshContext';
import { computeSplit } from '../utils/expenseSplit';
import { formatUsd, getExpenses, getMembers } from '../utils/expenseStorage';

export function ExpensesHomeCard() {
  const { refreshNonce } = useRefresh();
  const expenses = getExpenses();
  const members = getMembers();
  const { total, fairShare, transfers } = computeSplit(members, expenses);
  void refreshNonce;

  if (expenses.length === 0) {
    return (
      <div className="card expense-home-card">
        <h2>Trip expenses</h2>
        <p className="page-lead">Log meals and tickets to split costs equally at the end.</p>
        <Link to="/expenses" className="btn btn-primary">
          Add first expense →
        </Link>
      </div>
    );
  }

  return (
    <div className="card expense-home-card">
      <h2>Trip expenses</h2>
      <p className="expense-home-total">
        <strong>{formatUsd(total)}</strong> total · {formatUsd(fairShare)} / person
      </p>
      {transfers.length > 0 && (
        <p className="expense-home-settle">
          {transfers.length} settlement{transfers.length === 1 ? '' : 's'} to square up
        </p>
      )}
      <Link to="/expenses" className="btn btn-primary">
        View & settle up →
      </Link>
    </div>
  );
}
