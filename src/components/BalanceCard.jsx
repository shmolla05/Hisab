function BalanceCard({ balance, formatMoney }) {
  return (
    <section className="balance-card">
      <p>Current Balance</p>
      <h2>{formatMoney(balance)}</h2>
    </section>
  );
}

export default BalanceCard;