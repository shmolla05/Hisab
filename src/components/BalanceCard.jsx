function BalanceCard({ title = "Current Balance", balance, formatMoney }) {
  return (
    <section className="balance-card">
      <p>{title}</p>
      <h2>{formatMoney(balance)}</h2>
    </section>
  );
}

export default BalanceCard;