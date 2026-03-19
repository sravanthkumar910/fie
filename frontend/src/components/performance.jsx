import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function Performance() {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [projects, setProjects] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
fetch(`${import.meta.env.VITE_API_URL}/api/projects`),
fetch(`${import.meta.env.VITE_API_URL}/api/payments`)
        ])
        .then(([projectsRes, paymentsRes]) => Promise.all([projectsRes.json(), paymentsRes.json()]))
        .then(([projectsData, paymentsData]) => {
            setProjects(projectsData || []);
            setPayments(paymentsData || []);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, []);

    // Calculate unique platforms from projects
    const getUniquePlatforms = () => {
        const platformsSet = new Set();
        projects.forEach(project => {
            if (project.platforms) {
                if (Array.isArray(project.platforms)) {
                    project.platforms.forEach(p => platformsSet.add(p));
                } else if (typeof project.platforms === 'string') {
                    project.platforms.split(',').forEach(p => platformsSet.add(p.trim()));
                }
            }
        });
        return platformsSet.size || 0;
    };

    // Calculate total revenue from payments (completed payments)
    const totalRevenue = payments
        .filter(p => p.status === 'Completed')
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    // Calculate pending payments
    const pendingPayments = payments
        .filter(p => p.status === 'Pending')
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    // Calculate total budget from projects
    const totalProjectBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget?.replace(/[^0-9.-]+/g, '')) || 0), 0);

    const stats = {
        totalProjects: projects.length,
        totalBudget: totalProjectBudget,
        activePlatforms: getUniquePlatforms(),
        totalRevenue: totalRevenue,
        pendingPayments: pendingPayments,
        completedPayments: payments.filter(p => p.status === 'Completed').length
    };

    // Dynamic data based on date range
    const impressionsData = dateRange === 'Last 7 Days' ? [
        { date: 'Mon', impressions: 45000, reach: 32000 },
        { date: 'Tue', impressions: 52000, reach: 38000 },
        { date: 'Wed', impressions: 48000, reach: 35000 },
        { date: 'Thu', impressions: 61000, reach: 42000 },
        { date: 'Fri', impressions: 55000, reach: 39000 },
        { date: 'Sat', impressions: 72000, reach: 51000 },
        { date: 'Sun', impressions: 68000, reach: 48000 },
    ] : dateRange === 'Last 90 Days' ? [
        { date: 'Week 1', impressions: 890000, reach: 680000 },
        { date: 'Week 2', impressions: 920000, reach: 710000 },
        { date: 'Week 3', impressions: 1050000, reach: 820000 },
        { date: 'Week 4', impressions: 980000, reach: 750000 },
    ] : [
        { date: 'Week 1', impressions: 245000, reach: 180000 },
        { date: 'Week 2', impressions: 312000, reach: 240000 },
        { date: 'Week 3', impressions: 287000, reach: 210000 },
        { date: 'Week 4', impressions: 398000, reach: 320000 },
    ];

    // Generate platform performance from actual project platforms
    const getPlatformPerformance = () => {
        const platformData = {};
        projects.forEach(project => {
            if (project.platforms) {
                const platforms = Array.isArray(project.platforms) 
                    ? project.platforms 
                    : project.platforms.split(',').map(p => p.trim());
                
                platforms.forEach(platform => {
                    const normalizedPlatform = platform.toLowerCase();
                    if (!platformData[normalizedPlatform]) {
                        platformData[normalizedPlatform] = {
                            platform: platform,
                            impressions: 0,
                            projects: 0,
                            budget: 0
                        };
                    }
                    platformData[normalizedPlatform].projects += 1;
                    platformData[normalizedPlatform].budget += parseFloat(project.budget?.replace(/[^0-9.-]+/g, '')) || 0;
                });
            }
        });

        const platformColors = {
            instagram: { color: '#E1306C', icon: '📸' },
            tiktok: { color: '#00f2ea', icon: '🎵' },
            youtube: { color: '#FF0000', icon: '▶️' },
            twitter: { color: '#1DA1F2', icon: '🐦' },
            facebook: { color: '#4267B2', icon: '📘' },
            linkedin: { color: '#0077B5', icon: '💼' },
            default: { color: '#8B5CF6', icon: '🌐' }
        };

        return Object.entries(platformData).map(([key, data]) => ({
            ...data,
            ...(platformColors[key] || platformColors.default),
            impressions: data.impressions || `${data.projects * 120}K`,
            roi: `${Math.floor(data.budget * 0.15 + 100)}%`
        }));
    };

    const platformPerformance = getPlatformPerformance();

    // Generate engagement data from payments (using amounts as proxy for engagement activity)
    const engagementData = [
        { name: 'Completed', value: payments.filter(p => p.status === 'Completed').length || 45000, color: '#10B981' },
        { name: 'Pending', value: payments.filter(p => p.status === 'Pending').length || 15000, color: '#F59E0B' },
        { name: 'Processing', value: payments.filter(p => p.status === 'Processing').length || 9000, color: '#8B5CF6' },
        { name: 'Failed', value: payments.filter(p => p.status === 'Failed').length || 6000, color: '#EF4444' },
    ];

    const weeklyData = [
        { day: 'Mon', impressions: 45000 },
        { day: 'Tue', impressions: 52000 },
        { day: 'Wed', impressions: 48000 },
        { day: 'Thu', impressions: 61000 },
        { day: 'Fri', impressions: 55000 },
        { day: 'Sat', impressions: 72000 },
        { day: 'Sun', impressions: 68000 },
    ];

    const totalImpressions = impressionsData.reduce((sum, d) => sum + d.impressions, 0);

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
                <h1 style={{fontSize: '24px', fontWeight: '800', color: '#EAE8FF'}}>Performance Analytics</h1>
                <div style={{display: 'flex', gap: '8px'}}>
                    {['Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map(range => (
                        <div key={range} onClick={() => setDateRange(range)} style={{
                            padding: '6px 12px',
                            background: dateRange === range ? 'rgba(139, 92, 246, 0.1)' : '#161626',
                            border: '1px solid',
                            borderColor: dateRange === range ? '#8B5CF6' : 'rgba(255, 255, 255, 0.06)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: dateRange === range ? '#8B5CF6' : '#9896B8',
                            cursor: 'pointer'
                        }}>{range}</div>
                    ))}
                </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'}}>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '20px', borderTop: '3px solid #8B5CF6'}}>
                    <div style={{fontSize: '12px', color: '#9896B8', marginBottom: '8px'}}>Total Projects</div>
                    <div style={{fontSize: '28px', fontWeight: '800'}}>{stats.totalProjects}</div>
                </div>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '20px', borderTop: '3px solid #EC4899'}}>
                    <div style={{fontSize: '12px', color: '#9896B8', marginBottom: '8px'}}>Total Budget</div>
                    <div style={{fontSize: '28px', fontWeight: '800'}}>${(stats.totalBudget / 1000).toFixed(1)}K</div>
                </div>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '20px', borderTop: '3px solid #06B6D4'}}>
                    <div style={{fontSize: '12px', color: '#9896B8', marginBottom: '8px'}}>Active Platforms</div>
                    <div style={{fontSize: '28px', fontWeight: '800'}}>{stats.activePlatforms}</div>
                </div>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '20px', borderTop: '3px solid #10B981'}}>
                    <div style={{fontSize: '12px', color: '#9896B8', marginBottom: '8px'}}>Total Revenue</div>
                    <div style={{fontSize: '28px', fontWeight: '800'}}>${(stats.totalRevenue / 1000).toFixed(1)}K</div>
                </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'}}>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '20px', borderTop: '3px solid #F59E0B'}}>
                    <div style={{fontSize: '12px', color: '#9896B8', marginBottom: '8px'}}>Pending Payments</div>
                    <div style={{fontSize: '28px', fontWeight: '800'}}>${(stats.pendingPayments / 1000).toFixed(1)}K</div>
                </div>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '20px', borderTop: '3px solid #10B981'}}>
                    <div style={{fontSize: '12px', color: '#9896B8', marginBottom: '8px'}}>Completed Payments</div>
                    <div style={{fontSize: '28px', fontWeight: '800'}}>{stats.completedPayments}</div>
                </div>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '20px', borderTop: '3px solid #8B5CF6'}}>
                    <div style={{fontSize: '12px', color: '#9896B8', marginBottom: '8px'}}>Total Impressions</div>
                    <div style={{fontSize: '28px', fontWeight: '800'}}>{(totalImpressions / 1000).toFixed(1)}K</div>
                </div>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '20px', borderTop: '3px solid #EC4899'}}>
                    <div style={{fontSize: '12px', color: '#9896B8', marginBottom: '8px'}}>Total Payments</div>
                    <div style={{fontSize: '28px', fontWeight: '800'}}>{payments.length}</div>
                </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px'}}>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '24px'}}>
                    <div style={{fontWeight: '700', marginBottom: '20px', color: '#EAE8FF'}}>Impressions Over Time</div>
                    <div style={{height: '280px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={impressionsData}>
                                <defs>
                                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B6988', fontSize: 11}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B6988', fontSize: 11}} tickFormatter={(v) => v/1000 + 'k'} />
                                <Tooltip contentStyle={{background: '#161626', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px'}} />
                                <Area type="monotone" dataKey="impressions" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorImp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '24px'}}>
                    <div style={{fontWeight: '700', marginBottom: '20px', color: '#EAE8FF'}}>Payment Status</div>
                    <div style={{height: '200px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={engagementData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                                    {engagementData.map((entry, index) => <Cell key={'cell-' + index} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{background: '#161626', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px'}}>
                        {engagementData.map((entry, index) => (
                            <div key={index} style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#9896B8'}}>
                                <div style={{width: '8px', height: '8px', borderRadius: '2px', background: entry.color}}></div>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '24px'}}>
                    <div style={{fontWeight: '700', marginBottom: '20px', color: '#EAE8FF'}}>Weekly Performance</div>
                    <div style={{height: '200px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B6988', fontSize: 11}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B6988', fontSize: 11}} tickFormatter={(v) => v/1000 + 'k'} />
                                <Tooltip contentStyle={{background: '#161626', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px'}} />
                                <Bar dataKey="impressions" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '24px'}}>
                    <div style={{fontWeight: '700', marginBottom: '20px', color: '#EAE8FF'}}>Platform Performance</div>
                    <div>
                        {platformPerformance.length > 0 ? (
                            platformPerformance.map(platform => (
                                <div key={platform.platform} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)'}}>
                                    <div style={{width: '36px', height: '36px', borderRadius: '10px', background: platform.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'}}>{platform.icon}</div>
                                    <div style={{flex: 1}}>
                                        <div style={{fontWeight: '600', fontSize: '14px'}}>{platform.platform}</div>
                                        <div style={{fontSize: '11px', color: '#6B6988'}}>{platform.projects} project{platform.projects !== 1 ? 's' : ''}</div>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <div style={{fontWeight: '700', fontSize: '14px', color: '#10B981'}}>${platform.budget.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: 'center', padding: '40px', color: '#6B6988'}}>
                                <div style={{fontSize: '48px', marginBottom: '16px'}}>📊</div>
                                <div>No platform data available</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{background: '#0E0E1C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '24px'}}>
                <div style={{fontWeight: '700', marginBottom: '20px', color: '#EAE8FF'}}>Your Projects Performance</div>
                {loading ? (
                    <div style={{textAlign: 'center', padding: '40px', color: '#6B6988'}}>Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px', color: '#6B6988'}}>
                        <div style={{fontSize: '48px', marginBottom: '16px'}}>📊</div>
                        <div>No projects yet. Create your first project!</div>
                    </div>
                ) : (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
                        {projects.slice(0, 4).map((project, i) => (
                            <div key={project._id || i} style={{background: '#161626', borderRadius: '12px', padding: '16px'}}>
                                <div style={{fontWeight: '600', fontSize: '13px', marginBottom: '8px'}}>{project.name}</div>
                                <div style={{fontSize: '11px', color: '#9896B8', marginBottom: '12px'}}>
                                    {Array.isArray(project.platforms) ? project.platforms.join(', ') : (project.platforms || 'No platforms')}
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div>
                                        <div style={{fontSize: '14px', fontWeight: '700'}}>${project.budget || '0'}</div>
                                    </div>
                                    <div style={{
                                        fontSize: '10px',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: project.status === 'Live' ? '#10B98120' : 
                                                   project.status === 'Completed' ? '#8B5CF620' : 
                                                   project.status === 'Review' ? '#F59E0B20' : '#6B698820',
                                        color: project.status === 'Live' ? '#10B981' : 
                                               project.status === 'Completed' ? '#8B5CF6' : 
                                               project.status === 'Review' ? '#F59E0B' : '#6B6988'
                                    }}>
                                        {project.status || 'Planning'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

