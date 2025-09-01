import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [expenseData, setExpenseData] = useState({
    account_id: '',
    amount: '',
    paid_through_account_id: '',
    date: '',
    description: '',
    customer_id: '',
  });
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const syncChartOfAccounts = async () => {
    setNotification({ message: 'Syncing Chart of Accounts...', type: 'info' });
    try {
      const response = await fetch('/api/zoho/sync/chart-of-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message, 'success');
        fetchChartOfAccounts(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to sync chart of accounts');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const syncContacts = async () => {
    setNotification({ message: 'Syncing Contacts...', type: 'info' });
    try {
      const response = await fetch('/api/zoho/sync/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message, 'success');
        fetchContacts(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to sync contacts');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const syncReceipts = async () => {
    // Placeholder for sync logic
    setNotification({ message: 'Syncing Receipts...', type: 'info' });
    setTimeout(() => setNotification({ message: 'Receipts synced successfully!', type: 'success' }), 2000);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const fetchChartOfAccounts = async () => {
    const response = await fetch('/api/zoho/chart-of-accounts');
    const data = await response.json();
    setChartOfAccounts(data.chartofaccounts || []);
    showNotification('Chart of Accounts synced successfully!');
  };

  const fetchContacts = async () => {
    const response = await fetch('/api/zoho/contacts');
    const data = await response.json();
    setContacts(data.contacts || []);
    showNotification('Contacts synced successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/zoho/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });

    if (response.ok) {
      showNotification('Expense created successfully!');
      setExpenseData({
        account_id: '',
        amount: '',
        paid_through_account_id: '',
        date: '',
        description: '',
        customer_id: '',
      });
    } else {
      showNotification('Failed to create expense.', 'error');
    }
  };

  useEffect(() => {
    fetchChartOfAccounts();
    fetchContacts();
  }, []);

  return (
    <div className="dashboard-container">
      {notification.message && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <button onClick={syncChartOfAccounts} className="btn btn-secondary">Sync Chart of Accounts</button>
          <button onClick={syncContacts} className="btn btn-secondary">Sync Contacts</button>
          <button onClick={syncReceipts} className="btn btn-secondary">Sync Receipts</button>
        </div>
        <div className="profile-dropdown">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="profile-btn">
            {user?.Display_Name}
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item"><strong>{user?.Display_Name}</strong></div>
              <div className="dropdown-item">{user?.Email}</div>
              <div className="dropdown-divider"></div>
              <a href="http://localhost:8000/logout" className="dropdown-item logout">Logout</a>
            </div>
          )}
        </div>
      </header>

      <div className="dashboard-main">
        <div className="card">
          <div className="card-header">
            <h2>Create Expense</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input name="date" type="date" value={expenseData.date} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input name="amount" type="number" placeholder="0.00" value={expenseData.amount} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Expense Account</label>
                <select name="account_id" value={expenseData.account_id} onChange={handleInputChange} required>
                  <option value="">Select...</option>
                  {chartOfAccounts.filter(a => a.account_type === 'expense').map(account => (
                    <option key={account.account_id} value={account.account_id}>{account.account_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Paid Through</label>
                <select name="paid_through_account_id" value={expenseData.paid_through_account_id} onChange={handleInputChange} required>
                  <option value="">Select...</option>
                  {chartOfAccounts.filter(a => a.account_type === 'bank' || a.account_type === 'cash').map(account => (
                    <option key={account.account_id} value={account.account_id}>{account.account_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Customer (Optional)</label>
                <select name="customer_id" value={expenseData.customer_id} onChange={handleInputChange}>
                  <option value="">Select...</option>
                  {contacts.map(contact => (
                    <option key={contact.contact_id} value={contact.contact_id}>{contact.contact_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" placeholder="Expense description..." value={expenseData.description} onChange={handleInputChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Create Expense</button>
            </form>
          </div>
        </div>

        <div className="data-tables">
          <div className="card">
            <div className="card-header">
              <h2>Chart of Accounts</h2>
            </div>
            <div className="card-body">
              <ul className="data-list">
                {chartOfAccounts.map(account => (
                  <li key={account.account_id}><span>{account.account_name}</span> <span>{account.account_type}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Contacts</h2>
            </div>
            <div className="card-body">
              <ul className="data-list">
                {contacts.map(contact => (
                  <li key={contact.contact_id}>{contact.contact_name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
