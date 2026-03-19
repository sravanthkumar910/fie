import { useEffect, useState } from 'react';
import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const KPI = ({ icon, label, val, delta, color, trend }) => (
    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', borderTop: `2px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{icon}</span>
            <span style={{ fontSize: '11px', color: trend === 'up' ? 'var(--green)' : 'var(--red)', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: '10px' }}>
                {trend === 'up' ? '↑' : '↓'} {delta}
            </span>
        </div>
        <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '32px', fontWeight: '800', margin: '8px 0' }}>{val}</div>
        <div style={{ fontSize: '12px', color: 'var(--muted2)' }}>{label}</div>
    </div>
);

const StatusPill = ({ status }) => {
    const styles = {
        Live: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
        Review: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
        Draft: { bg: 'rgba(152,150,184,0.1)', color: '#9896B8' },
    };
    const style = styles[status] || styles.Draft;
    return (
        <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', background: style.bg, color: style.color, textTransform: 'uppercase', marginLeft: '8px' }}>
            {status}
        </span>
    );
};

export default function Dashboard() {
    const [showAllProjects, setShowAllProjects] = useState(false);
    const [showAllCreators, setShowAllCreators] = useState(false);
    const [showAllActivity, setShowAllActivity] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [transactions, setTransactions] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [platformData, setPlatformData] = useState([]);
    const [activeProjects, setActiveProjects] = useState([]);
    const [topCreators, setTopCreators] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [kpiStats, setKpiStats] = useState({ projects: 0, creators: 0, projBudget: 0, spentBudget: 0 });
    const [user, setUser] = useState({ name: "User", email: "" });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [settingsRes, projectsRes, paymentsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/settings`),
                    fetch(`${import.meta.env.VITE_API_URL}/api/projects`),
                    fetch(`${import.meta.env.VITE_API_URL}/api/payments`)
                ]);

                const settingsData = await settingsRes.json();
                const projects = await projectsRes.json();
                const payments = await paymentsRes.json();

                setUser({
                    name: settingsData.brandProfile?.name || "Sravanth Kumar",
                    email: settingsData.account?.email || "sravanthkumar@titanfit.com"
                });

                setActiveProjects(projects);
                setTransactions(payments);

                // --- KPI Calculations ---
                const totalProjBudget = projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
                const totalSpent = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
                const uniqueCreators = [...new Set(projects.flatMap(p => (p.creators || []).map(c => c.name)))];

                setKpiStats({
                    projects: projects.length,
                    creators: uniqueCreators.length,
                    projBudget: totalProjBudget.toLocaleString(),
                    spentBudget: totalSpent.toLocaleString()
                });

                // --- Graph: Payments Count by Day (Sun-Sat) ---
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayCounts = days.map(d => ({ name: d, count: 0 }));
                payments.forEach(p => {
                    const dIndex = new Date(p.createdAt).getDay();
                    dayCounts[dIndex].count += 1;
                });
                setPerformanceData(dayCounts);

                // --- Pie Chart: Budget Ratio ---
                const budgetSplit = [
                    { name: 'Total Budget', value: totalProjBudget, color: 'var(--pink)' },
                    { name: 'Paid to Creators', value: totalSpent, color: 'var(--green)' },
                ];
                setPlatformData(budgetSplit);

                // --- Top Creators ---
                const creatorMap = {};
                projects.flatMap(p => p.creators || []).forEach(c => {
                    if (!creatorMap[c.name]) creatorMap[c.name] = { name: c.name, handle: c.email, avatar: '👤' };
                });
                setTopCreators(Object.values(creatorMap).slice(0, 8));

                // --- Recent Activity: PROJECT SENDING MONEY TO CREATOR ---
                const activity = payments.slice().reverse().slice(0, 10).map(p => ({
                    icon: '💸',
                    user: p.project, // Project is the sender
                    action: `sent $${Number(p.amount).toLocaleString()} to`,
                    project: p.creator, // Creator is the receiver
                    time: new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setRecentActivity(activity);

            } catch (error) {
                console.error("Dashboard Sync Error:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        // Calculates the position exactly in the middle of the colored arc
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: '12px', fontWeight: '800' }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
                    Dashboard
                    <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--s2)', padding: '6px 12px', borderRadius: '8px', marginLeft: '12px' }}>
                        📅 Mar 1, 2026
                    </span>
                </h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <KPI icon="📁" label="All Projects" val={kpiStats.projects} delta="12%" color="var(--violet)" trend="up" />
                <KPI icon="🌟" label="Total Creators" val={kpiStats.creators} delta="5%" color="var(--cyan)" trend="up" />
                <KPI icon="💰" label="Project Budget" val={`$${kpiStats.projBudget}`} delta="8%" color="var(--green)" trend="up" />
                <KPI icon="📊" label="Creators Budget" val={`$${kpiStats.spentBudget}`} delta="2%" color="var(--pink)" trend="up" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={cardStyle}>
                    <span style={{ fontWeight: '700' }}>Sun-Sat Payment Transactions count</span>
                    <div style={{ height: '250px', marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData} margin={{ left: -20, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B6988', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B6988', fontSize: 10 }} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ ...cardStyle, alignItems: 'center' }}>
                    <div style={{ width: '100%', textAlign: 'left', fontWeight: '700', marginBottom: '20px' }}>Budget Split (%)</div>
                    <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={platformData}
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={1}
                                    dataKey="value"
                                    labelLine={false} // This removes the lines pointing outside
                                    label={renderCustomizedLabel} // This puts the percentage inside
                                >
                                    {platformData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px', justifyContent: 'center' }}>
                        {platformData.map(item => (
                            <div key={item.name} style={{ fontSize: '10px', color: 'var(--muted2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color }} /> {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '16px' }}>
                <div style={cardStyleNoPadding}>
                    <div style={listHeader}>
                        <span style={{ fontWeight: '700' }}>Active Projects</span>
                        <span onClick={() => setShowAllProjects(!showAllProjects)} style={viewAllLink}>{showAllProjects ? 'View Less' : 'View All'}</span>
                    </div>
                    {(showAllProjects ? activeProjects : activeProjects.slice(0, 5)).map((proj, i) => (
                        <div key={i} style={listItem}>
                            <div style={projectIcon}>📂</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>{proj.name} <StatusPill status={proj.status} /></div>
                                <div style={{ fontSize: '11px', color: 'var(--muted2)' }}>{proj.creators?.length || 0} creators · ${proj.budget}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={cardStyleNoPadding}>
                    <div style={listHeader}>
                        <span style={{ fontWeight: '700' }}>Top Creators</span>
                        <span onClick={() => setShowAllCreators(!showAllCreators)} style={viewAllLink}>{showAllCreators ? 'View Less' : 'View All'}</span>
                    </div>
                    {(showAllCreators ? topCreators : topCreators.slice(0, 5)).map((creator, i) => (
                        <div key={i} style={listItem}>
                            <div style={avatarCircle}>{creator.avatar}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>{creator.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--muted2)' }}>{creator.handle}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={cardStyleNoPadding}>
                    <div style={listHeader}>
                        <span style={{ fontWeight: '700' }}>Recent Payouts</span>
                        <span onClick={() => setShowAllActivity(!showAllActivity)} style={viewAllLink}>{showAllActivity ? 'Hide' : 'All'}</span>
                    </div>
                    {(showAllActivity ? recentActivity : recentActivity.slice(0, 5)).map((act, i) => (
                        <div key={i} style={{ padding: '14px 24px', display: 'flex', gap: '12px', borderBottom: '1px solid var(--border)' }}>
                            <div style={activityIcon}>{act.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px' }}><span style={{ fontWeight: '700' }}>{act.user}</span> {act.action} <span style={{ fontWeight: '700' }}>{act.project}</span></div>
                                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{act.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

// --- Dynamic Styles ---
const cardStyle = { background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' };
const cardStyleNoPadding = { background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px' };
const listHeader = { padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const listItem = { padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' };
const viewAllLink = { fontSize: '11px', color: 'var(--violet)', cursor: 'pointer', fontWeight: '600' };
const tooltipStyle = { background: '#161626', border: '1px solid var(--border)', borderRadius: '8px' };
const projectIcon = { width: '36px', height: '36px', borderRadius: '10px', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' };
const avatarCircle = { width: '32px', height: '32px', borderRadius: '50%', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' };
const activityIcon = { width: '32px', height: '32px', borderRadius: '8px', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const profileTriggerStyle = { width: '42px', height: '42px', borderRadius: '14px', background: 'var(--s2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' };
const avatarTextStyle = { fontSize: '15px', fontWeight: '800', background: 'linear-gradient(135deg, var(--violet), var(--pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
const dropdownStyle = { position: 'absolute', top: '52px', right: '0', width: '220px', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' };
const dividerStyle = { width: '100%', height: '1px', background: 'var(--border)', margin: '12px 0' };
const logoutButtonStyle = { width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(244,63,94,0.1)', color: '#F43F5E', border: 'none', fontWeight: '700', cursor: 'pointer', textAlign: 'left' };
