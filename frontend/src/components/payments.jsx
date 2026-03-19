import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';

// Constants for positioning labels inside the Pie sectors
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '10px', fontWeight: 'bold' }}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const StatusPill = ({ status }) => {
    const styles = {
        Completed: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
        Pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
        Processing: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
        Failed: { bg: 'rgba(244,63,94,0.1)', color: '#F43F5E' },
    };
    const style = styles[status] || styles.Pending;
    return (
        <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', background: style.bg, color: style.color, textTransform: 'uppercase' }}>
            {status}
        </span>
    );
};

export default function Payments({ propPayments, onAddPayment }) {
    // State Management - Hardcoded transactions removed
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState({ creator: '', amount: '', method: 'Bank Transfer', note: '', project: '', status: 'Pending' });
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
    // API-driven lists for dropdowns
    const [creatorsList, setCreatorsList] = useState([]); 
    const [projectsList, setProjectsList] = useState([]);

    // 1. Fetch Payments from API (GET)
    const fetchPayments = async () => {
        try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`);
            const data = await response.json();
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    // 2. Fetch Projects and Creators for Dropdowns
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
                const data = await response.json();
                
                const uniqueCreators = [...new Set(data.flatMap(project => 
                    (project.creators || []).map(c => c.name)
                ))];
                
                const uniqueProjects = [...new Set(data.map(project => project.name))];
                
                setCreatorsList(uniqueCreators);
                setProjectsList(uniqueProjects);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };
        fetchDropdownData();
        fetchPayments(); 
    }, []);

    // 3. Sync with propPayments if available
    useEffect(() => {
        if (propPayments && propPayments.length > 0) {
            setTransactions(propPayments);
        }
    }, [propPayments]);

    // Data filtering logic
    const filteredTransactions = filter === 'All' 
        ? transactions 
        : transactions.filter(t => t.status.toLowerCase() === filter.toLowerCase());

    // --- FINANCIAL CALCULATIONS ---
    const totalSpentValue = transactions
        .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const completedSum = transactions
        .filter(t => t.status === 'Completed')
        .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const pendingSum = transactions
        .filter(t => t.status === 'Pending' || t.status === 'Processing')
        .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const failedSum = transactions
        .filter(t => t.status === 'Failed')
        .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    // --- DYNAMIC DAILY SPENDING CALCULATION (Sun - Sat) ---
    const getDailyData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'wen', 'Thur', 'Fri', 'sat'];
        const dailyStats = days.map(day => ({ day, amount: 0 }));

        transactions.forEach(t => {
            const date = new Date(t.updatedAt || Date.now());
            const dayIndex = date.getDay(); // 0 for Sunday, 6 for Saturday
            dailyStats[dayIndex].amount += (Number(t.amount) || 0);
        });
        return dailyStats;
    };

    const dailyData = getDailyData();

    // --- DYNAMIC PIE DATA ---
    const pieData = [
        { name: 'Completed', value: completedSum, color: '#10B981' },
        { name: 'Pending', value: pendingSum, color: '#F59E0B' },
        { name: 'Failed', value: failedSum, color: '#F43F5E' },
    ].filter(item => item.value > 0);

    // 4. Handle Send Payment (POST to MongoDB)
    const handleSendPayment = async () => {
        if (paymentData.creator && paymentData.amount && paymentData.project) {
            try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(paymentData)
                });

                if (response.ok) {
                    setPaymentSuccess(true);
                    await fetchPayments(); // Refresh with GET

                    setTimeout(() => {
                        setShowPaymentModal(false);
                        setPaymentSuccess(false);
                        setPaymentData({ creator: '', amount: '', method: 'Bank Transfer', note: '', project: '', status: 'Pending' });
                    }, 1500);
                }
            } catch (error) {
                console.error('Failed to save payment:', error);
            }
        }
    };

    return (
        <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
                    Payments
                    <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--s2)', padding: '6px 12px', borderRadius: '8px', marginLeft: '12px' }}>
                        💳 {transactions.length} Transactions
                    </span>
                </h1>
                <button 
                    onClick={() => setShowPaymentModal(true)}
                    style={{ background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                    💸 Send Payment
                </button>
            </header>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', borderTop: '2px solid var(--violet)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '8px' }}>Total Amount</div>
                    <div style={{ fontSize: '28px', fontWeight: '800' }}>${totalSpentValue.toLocaleString()}</div>
                </div>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', borderTop: '2px solid var(--green)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '8px' }}>Completed</div>
                    <div style={{ fontSize: '28px', fontWeight: '800' }}>${completedSum.toLocaleString()}</div>
                </div>
                 <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', borderTop: '2px solid var(--pink)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '8px' }}>Pending</div>
                    <div style={{ fontSize: '28px', fontWeight: '800' }}>${pendingSum.toLocaleString()}</div>
                </div>
                 <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', borderTop: '2px solid #F43F5E' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '8px' }}>Failed</div>
                    <div style={{ fontSize: '28px', fontWeight: '800' }}>${failedSum.toLocaleString()}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', marginBottom: '24px' }}>
                {/* DAILY SPENDING BAR CHART */}
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontWeight: '700', marginBottom: '20px' }}>Daily Spending (Total)</div>
                    <div style={{ height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B6988', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6988', fontSize: 11 }} />
                                <Tooltip contentStyle={{ background: '#161626', border: '1px solid var(--border)', borderRadius: '8px' }} formatter={(v) => [`$${v}`, 'Spent']} />
                                <Bar dataKey="amount" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PIE CHART WITH PERCENTAGE INSIDE */}
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontWeight: '700', marginBottom: '20px' }}>Status Breakdown (%)</div>
                    <div style={{ height: '160px', marginBottom: '16px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={pieData} 
                                    innerRadius={40} 
                                    outerRadius={75} 
                                    paddingAngle={2} 
                                    dataKey="value"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {pieData.map(item => (
                            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--muted2)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['All', 'Completed', 'Pending', 'Processing', 'Failed'].map(f => (
                        <div key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'rgba(139, 92, 246, 0.1)' : 'var(--s2)', borderColor: filter === f ? 'var(--violet)' : 'var(--border)', color: filter === f ? 'var(--violet)' : 'var(--muted2)', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', border: '1px solid', cursor: 'pointer' }}>
                            {f}
                        </div>
                    ))}
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase' }}>Creator</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase' }}>Project</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase' }}>Amount</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? filteredTransactions.map((transaction, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{transaction.avatar || '👤'}</div>
                                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{transaction.creator}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--muted2)', fontSize: '13px' }}>{transaction.project}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: '700', fontSize: '14px' }}>${Number(transaction.amount).toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <StatusPill status={transaction.status} />
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--muted2)', fontSize: '12px' }}>{new Date(transaction.updatedAt || Date.now()).toLocaleDateString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted2)' }}>No transaction data found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Send Payment Modal */}
            {showPaymentModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowPaymentModal(false)}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', width: '480px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
                        {!paymentSuccess ? (
                            <>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Send Payment</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <select value={paymentData.creator} onChange={(e) => setPaymentData({...paymentData, creator: e.target.value})} style={inputStyle}>
                                        <option value="">Select Creator</option>
                                        {creatorsList.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <select value={paymentData.project} onChange={(e) => setPaymentData({...paymentData, project: e.target.value})} style={inputStyle}>
                                        <option value="">Select Project</option>
                                        {projectsList.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <input placeholder="Amount ($)" type="number" value={paymentData.amount} onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})} style={inputStyle} />
                                    <select value={paymentData.status} onChange={(e) => setPaymentData({...paymentData, status: e.target.value})} style={inputStyle}>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                    <select value={paymentData.method} onChange={(e) => setPaymentData({...paymentData, method: e.target.value})} style={inputStyle}>
                                        <option>Bank Transfer</option>
                                        <option>PayPal</option>
                                    </select>
                                    <textarea placeholder="Note (optional)" value={paymentData.note} onChange={(e) => setPaymentData({...paymentData, note: e.target.value})} style={{ ...inputStyle, height: '80px', resize: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                    <button onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={handleSendPayment} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Send Payment</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
                                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Payment Sent!</h2>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

const inputStyle = { padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' };