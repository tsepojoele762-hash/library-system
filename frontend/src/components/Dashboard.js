import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Error fetching books:", err));
  }, []);

  return (
    <div>
      <h1>Library Overview Dashboard</h1>
      <div className="card">
        <h3>Current Book Inventory Availability</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} className={book.quantity < 2 ? 'low-stock' : ''}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity} copies {book.quantity < 2 ? '(Low Stock!)' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;