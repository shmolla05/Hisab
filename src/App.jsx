import { useEffect, useRef, useState } from "react";
import "./App.css";

import BalanceCard from "./components/BalanceCard";
import MonthlySummary from "./components/MonthlySummary";
import WeeklySpending from "./components/WeeklySpending";
import LendBorrow from "./components/LendBorrow";
import StartingBalance from "./components/StartingBalance";
import AddTransaction from "./components/AddTransaction";
import TransactionHistory from "./components/TransactionHistory";

const DEFAULT_STARTING_BALANCE = 0;

const getSavedStartingBalance = () => {
  const saved = localStorage.getItem("hisab_starting_balance");

  return saved !== null ? Number(saved) : DEFAULT_STARTING_BALANCE;
};

const transactionTypes = [
  { value: "expense", label: "Expense" },
  { value: "deposit", label: "Deposit" },
  { value: "lent", label: "Lent" },
  { value: "borrowed", label: "Borrowed" },
  { value: "special", label: "Special Event" },
];

function App() {
  const [transactionPanelOpen, setTransactionPanelOpen] = useState(false);
  // -----------------------------
  // State
  // -----------------------------

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("hisab_transactions");

    if (saved) {
      return JSON.parse(saved);
    }

    return [];
  });

  const [startingBalance, setStartingBalance] = useState(
    getSavedStartingBalance
  );

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");

  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [note, setNote] = useState("");

  const fileInputRef = useRef(null);

const exportBackup = () => {
  const backupData = {
    app: "Hisab",
    version: 1,
    exportedAt: new Date().toISOString(),
    startingBalance,
    transactions,
  };

  const data = JSON.stringify(backupData, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `hisab-backup-${new Date()
    .toISOString()
    .split("T")[0]}.json`;

  link.click();

  URL.revokeObjectURL(url);
};

const importBackup = (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const backupData = JSON.parse(e.target.result);

      if (
        !backupData ||
        backupData.app !== "Hisab" ||
        !Array.isArray(backupData.transactions)
      ) {
        alert("Invalid Hisab backup file.");
        return;
      }

      const confirmed = window.confirm(
        "Import this backup? Your current transactions will be replaced."
      );

      if (!confirmed) {
        return;
      }

      setTransactions(backupData.transactions);

      if (typeof backupData.startingBalance === "number") {
        setStartingBalance(backupData.startingBalance);
      }

      alert("Backup restored successfully.");
    } catch {
      alert("Could not read the backup file.");
    }
  };

  reader.readAsText(file);

  event.target.value = "";
};

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const goToPreviousMonth = () => {
   if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((year) => year - 1);
    } else {
      setSelectedMonth((month) => month - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((year) => year + 1);
    } else {
      setSelectedMonth((month) => month + 1);
    }
  };

  // -----------------------------
  // Save transactions
  // -----------------------------

  useEffect(() => {
    localStorage.setItem(
      "hisab_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  // -----------------------------
  // Add transaction
  // -----------------------------

  const addTransaction = () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type,
      amount: value,
      date,
      note: note.trim(),
    };

    setTransactions((previous) => [
      newTransaction,
      ...previous,
    ]);

    setAmount("");
    setNote("");
  };

  // -----------------------------
  // Delete transaction
  // -----------------------------

  const deleteTransaction = (id) => {
    const confirmed = window.confirm(
      "Delete this transaction?"
    );

    if (confirmed) {
      setTransactions((previous) =>
        previous.filter(
          (transaction) => transaction.id !== id
        )
      );
    }
  };

  // -----------------------------
  // Edit transaction
  // -----------------------------

  const editTransaction = (updatedTransaction) => {
  setTransactions((previous) =>
    previous.map((item) =>
      item.id === updatedTransaction.id
        ? updatedTransaction
        : item
    )
  );
};

  // -----------------------------
  // Balance calculation
  // -----------------------------

  const getBalanceEffect = (transaction) => {
    if (
      transaction.type === "deposit" ||
      transaction.type === "borrowed"
    ) {
      return transaction.amount;
    }

    return -transaction.amount;
  };

  const balance =
    startingBalance +
    transactions.reduce(
      (total, transaction) =>
        total + getBalanceEffect(transaction),
      0
    );

  // -----------------------------
  // Current month
  // -----------------------------

  const currentMonthTransactions = transactions.filter(
  (transaction) => {
    const transactionDate = new Date(transaction.date);

    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  }
);
  
  const monthlyTransactions = transactions.filter(
    (transaction) => {
      const transactionDate = new Date(transaction.date);

      return (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    }
  );

  // -----------------------------
  // Monthly expenses
  // -----------------------------

  const monthlyExpenses = monthlyTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense" ||
        transaction.type === "special"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  // -----------------------------
  // Monthly deposits
  // -----------------------------

  const monthlyDeposits = monthlyTransactions
    .filter(
      (transaction) => transaction.type === "deposit"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  // -----------------------------
  // Weekly expenses
  // -----------------------------

const weeklyExpenses = [0, 0, 0, 0, 0];

currentMonthTransactions.forEach((transaction) => {
  if (
    transaction.type === "expense" ||
    transaction.type === "special"
  ) {
    const date = new Date(transaction.date);
    const day = date.getDate();
    const firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();

    const week = Math.min(
      Math.floor((day + firstDay - 1) / 7),
      4
    );

    weeklyExpenses[week] += transaction.amount;
  }
});

  // -----------------------------
  // Lend & Borrow
  // -----------------------------

  const totalLent = transactions
    .filter(
      (transaction) => transaction.type === "lent"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const totalBorrowed = transactions
    .filter(
      (transaction) =>
        transaction.type === "borrowed"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  // -----------------------------
  // Money formatting
  // -----------------------------

  const changeMonth = (direction) => {
    const newDate = new Date(
      selectedYear,
      selectedMonth + direction,
      1
    );

    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };
  
  const formatMoney = (value) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="app">
      <header className="header">
        <h1>Hisab</h1>
        <p>Personal Money Tracker</p>
      </header>

      <main className="container">

  {/* Current Balance */}
  <BalanceCard
    balance={balance}
    formatMoney={formatMoney}
  />

  {/* Monthly Summary */}
  <div className="month-selector">
    <button
      className="month-button"
      onClick={goToPreviousMonth}
    >
      ‹
    </button>

    <div className="month-title">
      <strong>
        {monthNames[selectedMonth]} {selectedYear}
      </strong>
    </div>

    <button
      className="month-button"
      onClick={goToNextMonth}
    >
      ›
    </button>
  </div>

  <MonthlySummary
    monthlyDeposits={monthlyDeposits}
    monthlyExpenses={monthlyExpenses}
    formatMoney={formatMoney}
  />

  {/* Lend & Borrow */}
  <LendBorrow
    totalLent={totalLent}
    totalBorrowed={totalBorrowed}
    formatMoney={formatMoney}
  />

  {/* Add Transaction */}
  <AddTransaction
    type={type}
    setType={setType}
    amount={amount}
    setAmount={setAmount}
    date={date}
    setDate={setDate}
    note={note}
    setNote={setNote}
    addTransaction={addTransaction}
    transactionTypes={transactionTypes}
  />

  {/* Weekly Spending */}
  <WeeklySpending
    weeklyExpenses={weeklyExpenses}
    formatMoney={formatMoney}
  />

  {/* Starting Balance */}
  <StartingBalance
    startingBalance={startingBalance}
    setStartingBalance={setStartingBalance}
  />

  {/* Transaction History */}
  <TransactionHistory
  transactions={transactions}
  transactionTypes={transactionTypes}
  formatMoney={formatMoney}
  deleteTransaction={deleteTransaction}
  editTransaction={editTransaction}
  transactionPanelOpen={transactionPanelOpen}
  setTransactionPanelOpen={setTransactionPanelOpen}
/>

  {/* Backup & Restore */}
<section className="card backup-card">
  <h3>Backup & Restore</h3>

  <p className="backup-description">
    Keep a copy of your Hisab data or restore it later.
  </p>

  <div className="backup-actions">
    <button
      className="backup-button export-button"
      onClick={exportBackup}
    >
      Export Backup
    </button>

    <button
      className="backup-button import-button"
      onClick={() => fileInputRef.current?.click()}
    >
      Import Backup
    </button>

    <input
      ref={fileInputRef}
      type="file"
      accept=".json,application/json"
      onChange={importBackup}
      style={{ display: "none" }}
    />
  </div>
</section>

</main>

    </div>
  );
}

export default App;