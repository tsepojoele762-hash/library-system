import React, { useState, useEffect } from 'react';

function UserManagement({ onLogin, isAdminView }) {
  const [users, setUsers] = useState([]);
  const [loginId, setLoginId] = useState('');
  const [userForm, setUserForm] = useState({ name: '', membership_id: '', role: 'Admin' });

  useEffect(() => { if(isAdminView) fetchUsers(); }, [isAdminView]);

  const fetchUsers = () => { fetch('http://localhost:5000/users').then(res => res.json()).then(data => setUsers(data)); };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membership_id: loginId })
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) onLogin(data.user);
      else alert("Authentication failed. Membership ID not recognized.");
    });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm)
    }).then(() => {
      fetchUsers();
      setUserForm({ name: '', membership_id: '', role: 'Admin' });
    });
  };

  const handleDeleteUser = (id) => {
    if(window.confirm("Purge user account profile?")) {
      fetch(`http://localhost:5000/users/${id}`, { method: 'DELETE' }).then(() => fetchUsers());
    }
  };

  if (!isAdminView) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto' }} className="card">
        <h2>System Portal Sign-In</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label>Membership Identification Key (Default Seed: MEM001)</label>
            <input type="text" value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="Enter Member ID" required />
          </div>
          <button type="submit" className="btn-submit">Authenticate Secure Identity</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>System Account & Identity Management</h1>
      <div className="card">
        <h3>Register System User</h3>
        <form onSubmit={handleCreateUser}>
          <div className="form-group"><input type="text" placeholder="Full Name Name" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} required /></div>
          <div className="form-group"><input type="text" placeholder="Membership ID Code" value={userForm.membership_id} onChange={e => setUserForm({...userForm, membership_id: e.target.value})} required /></div>
          <div className="form-group">
            <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
              <option value="Admin">Administrator Officer</option>
              <option value="Member">Standard Registered Patron</option>
            </select>
          </div>
          <button type="submit" className="btn-submit">Commit Profile Creation</button>
        </form>
      </div>

      <div className="card">
        <h3>Active System Registrations</h3>
        <table>
          <thead><tr><th>Name</th><th>Membership ID</th><th>Assigned Authorization Role</th><th>Controls</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.membership_id}</td><td>{u.role}</td>
                <td><button onClick={() => handleDeleteUser(u.id)} className="btn-danger">Purge</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;