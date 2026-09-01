function StartingBalance({
  startingBalance,
  setStartingBalance,
}) {
  const handleChange = (event) => {
    const value = Number(event.target.value);

    setStartingBalance(value);

    localStorage.setItem(
      "hisab_starting_balance",
      value.toString()
    );
  };

  return (
    <section className="card">
      <h3>Starting Balance</h3>

      <input
        type="number"
        min="0"
        value={startingBalance}
        onChange={handleChange}
      />
    </section>
  );
}

export default StartingBalance;