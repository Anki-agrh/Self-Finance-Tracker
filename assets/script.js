let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editingId = null;

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const budget = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expense = (amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0) * -1).toFixed(2);

  document.getElementById('balance').innerText = `₹${total}`;
  document.getElementById('budget').innerText = `₹${budget}`;
  document.getElementById('expenses').innerText = `₹${expense}`;
}

function addTransaction(e) {
  e.preventDefault();

  const desc = document.getElementById('desc').value.trim();
  let amount = +document.getElementById('amount').value;
  const flow = document.getElementById('flow').value;
  const category = document.getElementById('category').value.trim();
  const note = document.getElementById('note').value.trim();
  const date = new Date().toLocaleString();

  if (desc === '' || isNaN(amount)) {
    alert("Please fill all fields correctly.");
    return;
  }

  amount = flow === 'out' ? -Math.abs(amount) : Math.abs(amount);

  if (editingId) {
    // Update existing transaction
    transactions = transactions.map(t =>
      t.id === editingId ? { ...t, desc, amount, category, note, date } : t
    );
    editingId = null;
    document.getElementById('submitBtn').innerText = 'Add Transaction';
  } else {
    // New transaction
    const transaction = {
      id: Date.now(),
      desc,
      amount,
      category,
      note,
      date
    };
    transactions.push(transaction);
  }

  updateLocalStorage();
  renderTransactions();
  updateValues();
  document.getElementById('form').reset();
}

function renderTransactions() {
  const list = document.getElementById('transaction-list');
  list.innerHTML = '';

  transactions.forEach(tx => {
    const li = document.createElement('li');
    const sign = tx.amount > 0 ? '+' : '-';
    li.classList.add(tx.amount > 0 ? 'budget' : 'expense');
    li.innerHTML = `
      <strong>${tx.desc}</strong> (${tx.category})<br/>
      Amount: ${sign}₹${Math.abs(tx.amount)}<br/>
      Note: ${tx.note || 'N/A'}<br/>
      Date: ${tx.date}
      <button class="delete-btn" onclick="deleteTransaction(${tx.id})">×</button>
      <button class="edit-btn" onclick="editTransaction(${tx.id})"> </button>
    `;
    list.appendChild(li);
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
  updateValues();
}

function editTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (tx) {
    document.getElementById('desc').value = tx.desc;
    document.getElementById('amount').value = Math.abs(tx.amount);
    document.getElementById('flow').value = tx.amount < 0 ? 'out' : 'in';
    document.getElementById('category').value = tx.category;
    document.getElementById('note').value = tx.note;
    editingId = id;
    document.getElementById('submitBtn').innerText = 'Update Transaction';
  }
}

function init() {
  document.getElementById('form').addEventListener('submit', addTransaction);
  renderTransactions();
  updateValues();
}

init();
