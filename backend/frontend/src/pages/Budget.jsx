import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import { budgetService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Budget() {
  const { tripId } = useParams();
  const { currentTrip, getTrip } = useTrip();
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({
    category: 'activities',
    amount: '',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await getTrip(tripId);
      
      const summaryResponse = await budgetService.getSummary(tripId);
      setSummary(summaryResponse.data);
      
      const recordsResponse = await budgetService.listRecords(tripId);
      setRecords(recordsResponse.data || []);
      
      setLoading(false);
    };
    loadData();
  }, [tripId]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!newRecord.amount) {
      alert('Please enter an amount');
      return;
    }

    const result = await budgetService.addRecord(tripId, {
      category: newRecord.category,
      amount: parseFloat(newRecord.amount),
      notes: newRecord.notes
    });

    if (result) {
      setRecords([...records, result.data]);
      setNewRecord({ category: 'activities', amount: '', notes: '' });
      setShowAddRecord(false);

      const summaryResponse = await budgetService.getSummary(tripId);
      setSummary(summaryResponse.data);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Delete this expense?')) {
      await budgetService.deleteRecord(recordId);
      setRecords(records.filter(r => r.id !== recordId));
      
      const summaryResponse = await budgetService.getSummary(tripId);
      setSummary(summaryResponse.data);
    }
  };

  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }

  const chartData = summary ? [
    { name: 'Transport', value: summary.total_transport },
    { name: 'Stay', value: summary.total_stay },
    { name: 'Activities', value: summary.total_activities },
    { name: 'Meals', value: summary.total_meals },
    { name: 'Parking', value: summary.total_parking }
  ].filter(item => item.value > 0) : [];

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>💰 Trip Budget</h1>
        <button onClick={() => navigate(`/trip/${tripId}/itinerary`)} style={styles.backBtn}>
          ← Back to Itinerary
        </button>
      </div>

      {summary && (
        <div style={styles.summaryCards}>
          <div style={styles.card}>
            <span style={styles.label}>Total Budget</span>
            <p style={styles.amount}>${summary.total_cost.toFixed(2)}</p>
          </div>
          <div style={styles.card}>
            <span style={styles.label}>Remaining</span>
            <p style={{
              ...styles.amount,
              color: currentTrip?.budget_limit && summary.total_cost > currentTrip.budget_limit ? '#dc3545' : '#28a745'
            }}>
              ${currentTrip?.budget_limit ? (currentTrip.budget_limit - summary.total_cost).toFixed(2) : 'Unlimited'}
            </p>
          </div>
          <div style={styles.card}>
            <span style={styles.label}>Budget Limit</span>
            <p style={styles.amount}>${currentTrip?.budget_limit?.toFixed(2) || 'N/A'}</p>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div style={styles.chartsContainer}>
          <div style={styles.chart}>
            <h3>Spending by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chart}>
            <h3>Budget Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!showAddRecord && (
        <button onClick={() => setShowAddRecord(true)} style={styles.addBtn}>
          ➕ Add Expense
        </button>
      )}

      {showAddRecord && (
        <div style={styles.formBox}>
          <h3>Add New Expense</h3>
          <form onSubmit={handleAddRecord} style={styles.form}>
            <select
              value={newRecord.category}
              onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
              style={styles.input}
            >
              <option value="transport">Transport</option>
              <option value="stay">Stay</option>
              <option value="activities">Activities</option>
              <option value="meals">Meals</option>
              <option value="parking">Parking</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>

            <input
              type="number"
              placeholder="Amount ($)"
              value={newRecord.amount}
              onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
              style={styles.input}
              step="0.01"
              required
            />

            <textarea
              placeholder="Notes (optional)"
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              style={styles.textarea}
            />

            <div style={styles.actions}>
              <button type="submit" style={styles.btn}>Save Expense</button>
              <button type="button" onClick={() => setShowAddRecord(false)} style={styles.btnCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.recordsContainer}>
        <h3>Expense Records</h3>
        {records.length === 0 ? (
          <p style={styles.emptyState}>No expenses recorded yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} style={styles.tableRow}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td><span style={styles.badge}>{record.category}</span></td>
                  <td style={styles.amount}>${record.amount.toFixed(2)}</td>
                  <td>{record.notes}</td>
                  <td>
                    <button onClick={() => handleDeleteRecord(record.id)} style={styles.deleteBtn}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #007bff', paddingBottom: '20px' },
  backBtn: { padding: '10px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  summaryCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  card: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  label: { display: 'block', color: '#666', fontSize: '12px', marginBottom: '8px' },
  amount: { margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#007bff' },
  chartsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' },
  chart: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' },
  addBtn: { padding: '12px 24px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginBottom: '20px' },
  formBox: { backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit' },
  textarea: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', minHeight: '80px' },
  actions: { display: 'flex', gap: '12px' },
  btn: { flex: 1, padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnCancel: { flex: 1, padding: '10px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  recordsContainer: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' },
  emptyState: { textAlign: 'center', color: '#999', padding: '40px 20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' },
  tableRow: { borderBottom: '1px solid #ddd' },
  badge: { display: 'inline-block', backgroundColor: '#007bff', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }
};