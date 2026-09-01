function WeeklySpending({ weeklyExpenses, formatMoney }) {
  return (
    <section className="card">
      <h3>Weekly Spending</h3>

      <div className="summary">
        {weeklyExpenses.map((amount, index) => (
          <div key={index}>
            <span>Week {index + 1}</span>
            <strong>{formatMoney(amount)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeeklySpending;