function LendBorrow({ totalLent, totalBorrowed, formatMoney }) {
  return (
    <section className="card">
      <h3>Lend & Borrow</h3>

      <div className="summary">
        <div>
          <span>Total Lent</span>
          <strong>{formatMoney(totalLent)}</strong>
        </div>

        <div>
          <span>Total Borrowed</span>
          <strong>{formatMoney(totalBorrowed)}</strong>
        </div>
      </div>
    </section>
  );
}

export default LendBorrow;