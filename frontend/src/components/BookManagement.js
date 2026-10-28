import React, { useState, useEffect } from 'react';

function BookManagement() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: '', author: '', genre: '', isbn: '', quantity: 1 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = () => {
    fetch('http://localhost:5000/books')
      .then(res => res.json())
      .then(data => setBooks(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5000/books/${editingId}` : 'http://localhost:5000/books';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => {
      fetchBooks();
      setFormData({ title: '', author: '', genre: '', isbn: '', quantity: 1 });
      setEditingId(null);
    });
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setFormData(book);
  };

  const handleDelete = (id) => {
    if(window.confirm("Delete this book?")) {
      fetch(`http://localhost:5000/books/${id}`, { method: 'DELETE' }).then(() => fetchBooks());
    }
  };

  return (
    <div>
      <h1>Book Asset Management</h1>
      <div className="card">
        <h3>{editingId ? "Update Book Details" : "Register New Book Entry"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
          <div className="form-group"><input type="text" placeholder="Author" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required /></div>
          <div className="form-group"><input type="text" placeholder="Genre" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} required /></div>
          <div className="form-group"><input type="text" placeholder="ISBN" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} required /></div>
          <div className="form-group"><input type="number" placeholder="Initial Stock Quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} required /></div>
          <button type="submit" className="btn-submit">{editingId ? "Save Changes" : "Add Book"}</button>
        </form>
      </div>

      <div className="card">
        <h3>Managed Catalog</h3>
        <table>
          <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Actions</th></tr></thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td><td>{book.author}</td><td>{book.isbn}</td>
                <td>
                  <button onClick={() => handleEdit(book)} className="btn-edit">Update</button>
                  <button onClick={() => handleDelete(book)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookManagement;