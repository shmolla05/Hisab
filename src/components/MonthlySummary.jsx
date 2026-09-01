function MonthlySummary({
  monthlyDeposits,
  monthlyExpenses,
  formatMoney,
}) {
  const net = monthlyDeposits - monthlyExpenses;

  return (
    <section className="card">
      <h3>This Month</h3>

      <div className="summary">
        <div>
          <span>Deposits</span>
          <strong>{formatMoney(monthlyDeposits)}</strong>
        </div>

        <div>
          <span>Expenses</span>
          <strong>{formatMoney(monthlyExpenses)}</strong>
        </div>

        <div>
          <span>Net</span>
          <strong>{formatMoney(net)}</strong>
        </div>
      </div>
    </section>
  );
}

export default MonthlySummary;