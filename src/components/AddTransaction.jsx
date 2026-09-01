function AddTransaction({
  type,
  setType,
  amount,
  setAmount,
  date,
  setDate,
  note,
  setNote,
  addTransaction,
  transactionTypes,
}) {
  return (
    <section className="card">
      <h3>Add Transaction</h3>

      <label>Type</label>

      <select
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        {transactionTypes.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <label>Amount</label>

      <input
        type="number"
        min="0"
        placeholder="Enter amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <label>Date</label>

      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />

      <label>Note / Person</label>

      <input
        type="text"
        placeholder="Optional"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />

      <button onClick={addTransaction}>
        Add Transaction
      </button>
    </section>
  );
}

export default AddTransaction;