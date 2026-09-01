import { useState } from "react";

function TransactionHistory({
  transactions,
  transactionTypes,
  formatMoney,
  deleteTransaction,
  editTransaction,
  transactionPanelOpen,
  setTransactionPanelOpen,
}) {
  const [editingId, setEditingId] = useState(null);

  const [editType, setEditType] = useState("expense");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const startEditing = (transaction) => {
    setEditingId(transaction.id);
    setEditType(transaction.type);
    setEditAmount(transaction.amount.toString());
    setEditDate(transaction.date);
    setEditNote(transaction.note || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditType("expense");
    setEditAmount("");
    setEditDate("");
    setEditNote("");
  };

  const saveEdit = () => {
    const value = Number(editAmount);

    if (!value || value <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!editDate) {
      alert("Please select a date.");
      return;
    }

    const updatedTransaction = {
      id: editingId,
      type: editType,
      amount: value,
      date: editDate,
      note: editNote.trim(),
    };

    editTransaction(updatedTransaction);
    cancelEditing();
  };

  const getTypeLabel = (transactionType) => {
    const found = transactionTypes.find(
      (item) => item.value === transactionType
    );

    return found ? found.label : transactionType;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      transaction.note?.toLowerCase().includes(search) ||
      getTypeLabel(transaction.type)
        .toLowerCase()
        .includes(search) ||
      transaction.date.includes(search) ||
      transaction.amount.toString().includes(search);

    const matchesType =
      filterType === "all" ||
      transaction.type === filterType;

    return matchesSearch && matchesType;
  });

  const displayedTransactions = transactionPanelOpen
    ? filteredTransactions
    : filteredTransactions.slice(0, 5);

  if (transactionPanelOpen) {
    return (
      <div className="transaction-panel">
        <div className="transaction-panel-header">
          <button
            className="back-button"
            onClick={() => setTransactionPanelOpen(false)}
          >
            ← Back
          </button>

          <h2>All Transactions</h2>
        </div>

        <div className="transaction-panel-content">
          {transactions.length === 0 ? (
            <p className="empty">No transactions yet.</p>
          ) : (
            <>
              <div className="transaction-filters">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />

                <select
                  value={filterType}
                  onChange={(event) =>
                    setFilterType(event.target.value)
                  }
                >
                  <option value="all">
                    All Transactions
                  </option>

                  {transactionTypes.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {filteredTransactions.length === 0 ? (
                <p className="empty">
                  No matching transactions found.
                </p>
              ) : (
                <div className="transactions">
                  {displayedTransactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      transactionTypes={transactionTypes}
                      formatMoney={formatMoney}
                      getTypeLabel={getTypeLabel}
                      editingId={editingId}
                      editType={editType}
                      editAmount={editAmount}
                      editDate={editDate}
                      editNote={editNote}
                      setEditType={setEditType}
                      setEditAmount={setEditAmount}
                      setEditDate={setEditDate}
                      setEditNote={setEditNote}
                      startEditing={startEditing}
                      cancelEditing={cancelEditing}
                      saveEdit={saveEdit}
                      deleteTransaction={deleteTransaction}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="card">
      <h3>Transaction History</h3>

      {transactions.length === 0 ? (
        <p className="empty">No transactions yet.</p>
      ) : (
        <>
          <div className="transaction-filters">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <select
              value={filterType}
              onChange={(event) =>
                setFilterType(event.target.value)
              }
            >
              <option value="all">All Transactions</option>

              {transactionTypes.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="empty">
              No matching transactions found.
            </p>
          ) : (
            <>
              <div className="transactions">
                {displayedTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    transactionTypes={transactionTypes}
                    formatMoney={formatMoney}
                    getTypeLabel={getTypeLabel}
                    editingId={editingId}
                    editType={editType}
                    editAmount={editAmount}
                    editDate={editDate}
                    editNote={editNote}
                    setEditType={setEditType}
                    setEditAmount={setEditAmount}
                    setEditDate={setEditDate}
                    setEditNote={setEditNote}
                    startEditing={startEditing}
                    cancelEditing={cancelEditing}
                    saveEdit={saveEdit}
                    deleteTransaction={deleteTransaction}
                  />
                ))}
              </div>

              {filteredTransactions.length > 5 && (
                <button
                  className="view-all-button"
                  onClick={() =>
                    setTransactionPanelOpen(true)
                  }
                >
                  View All Transactions →
                </button>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

function TransactionItem({
  transaction,
  transactionTypes,
  formatMoney,
  getTypeLabel,
  editingId,
  editType,
  editAmount,
  editDate,
  editNote,
  setEditType,
  setEditAmount,
  setEditDate,
  setEditNote,
  startEditing,
  cancelEditing,
  saveEdit,
  deleteTransaction,
}) {
  return (
    <div className="transaction" key={transaction.id}>
      {editingId === transaction.id ? (
        <div className="edit-form">
          <label>Type</label>

          <select
            value={editType}
            onChange={(event) =>
              setEditType(event.target.value)
            }
          >
            {transactionTypes.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

          <label>Amount</label>

          <input
            type="number"
            min="0"
            value={editAmount}
            onChange={(event) =>
              setEditAmount(event.target.value)
            }
          />

          <label>Date</label>

          <input
            type="date"
            value={editDate}
            onChange={(event) =>
              setEditDate(event.target.value)
            }
          />

          <label>Note / Person</label>

          <input
            type="text"
            value={editNote}
            placeholder="Optional"
            onChange={(event) =>
              setEditNote(event.target.value)
            }
          />

          <div className="edit-actions">
            <button
              className="delete-button"
              onClick={cancelEditing}
            >
              Cancel
            </button>

            <button
              className="delete-button"
              onClick={saveEdit}
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <strong>
              {getTypeLabel(transaction.type)}
            </strong>

            <small>
              {transaction.date}
              {transaction.note
                ? ` • ${transaction.note}`
                : ""}
            </small>
          </div>

          <div className="transaction-right">
            <strong
              className={
                transaction.type === "deposit" ||
                transaction.type === "borrowed"
                  ? "amount-positive"
                  : "amount-negative"
              }
            >
              {transaction.type === "deposit" ||
              transaction.type === "borrowed"
                ? "+"
                : "-"}
              {formatMoney(transaction.amount)}
            </strong>

            <button
              className="delete-button"
              onClick={() =>
                startEditing(transaction)
              }
            >
              Edit
            </button>

            <button
              className="delete-button"
              onClick={() =>
                deleteTransaction(transaction.id)
              }
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TransactionHistory;