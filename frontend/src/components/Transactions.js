import React, { useState, useEffect } from 'react';

function Transactions() {
  const [books, setBooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tx, setTx] = useState({ book_id: '', type: 'borrow', quantity: 1 });

  useEffect(() => { fetchBooks(); fetchLogs(); }, []);

  const fetchBooks = () => { fetch('http://localhost:5000/books').then(res => res.json()).then(data => setBooks(data)); };
  const fetchLogs = () => { fetch('http://localhost:5000/transactions').then(res => res.json()).then(data => setLogs(data)); };

  const handleTransaction = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx)
    }).then(res => {
      if(!res.ok) alert("Transaction rejected: Insufficient database stock levels.");
      fetchBooks(); fetchLogs();
    });
  };

  return (
    <div>
      <h1>Stock Ledger & Transactions</h1>
      <div className="card">
        <h3>Record Stock Transaction</h3>
        <form onSubmit={handleTransaction}>
          <div className="form-group">
            <select value={tx.book_id} onChange={e => setTx({...tx, book_id: e.target.value})} required>
              <option value="">-- Choose Book Target --</option>
              {books.map(b => <option key={b.id} value={b.id}>{b.title} (In Stock: {b.quantity})</option>)}
            </select>
          </div>
          <div className="form-group">
            <select value={tx.type} onChange={e => setTx({...tx, type: e.target.value})}>
              <option value="borrow">Borrow Book (Deduct Stock)</option>
              <option value="return">Return Book / Add Stock (Add Stock)</option>
            </select>
          </div>
          <div className="form-group"><input type="number" min="1" value={tx.quantity} onChange={e => setTx({...tx, quantity: parseInt(e.target.value)})} required /></div>
          <button type="submit" className="btn-submit">Process Transaction Entry</button>
        </form>
      </div>

      <div className="card">
        <h3>Transaction History System Log</h3>
        <table>
          <thead><tr><th>Timestamp</th><th>Book ID</th><th>Type Action</th><th>Delta Amount</th></tr></thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleString()}</td><td>{log.book_id}</td>
                <td style={{color: log.type === 'borrow' ? 'red' : 'green'}}>{log.type.toUpperCase()}</td><td>{log.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;