import { useEffect, useState } from 'react';

// --- HARDCODED REVIEWS DATA ---
const hardcodedReviews = [
    { creator: 'Maya Chen', rating: 5, comment: 'Amazing brand to work with! Great communication and timely payments. Would love to collaborate again!', date: 'Feb 2026' },
    { creator: 'Jordan Reeves', rating: 5, comment: 'TitanFit Co. really knows how to treat their creators. Professional and supportive throughout the campaign.', date: 'Jan 2026' },
    { creator: 'Priya Nair', rating: 4, comment: 'Great experience overall. Clear guidelines and feedback. Would recommend to other creators.', date: 'Dec 2025' },
];

export default function BrandProfile() {
    const [activeSection, setActiveSection] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiData, setApiData] = useState(null);

    // Fetch Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
                const data = await response.json();
                setApiData(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    // Fetch Projects (Campaigns and Creators)
    const fetchCreators = async () => {
        try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
            const data = await response.json();
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreators();
    }, []);

    // --- DATA PROCESSING (Strictly API based) ---
    const brandName = apiData?.brandProfile?.name || "";
    const initials = brandName ? brandName.split(' ').map(n => n[0]).join('').toUpperCase() : "";

    // Derived Stats
    const totalCampaigns = projects.length;
    const totalCreatorsCount = projects.reduce((acc, curr) => acc + (curr.creators?.length || 0), 0);

    const allCreators = projects.flatMap(p => (p.creators || []).map(c => ({
        name: c.name,
        handle: c.email, 
        campaigns: 1, 
        avatar: '👤'
    })));

    return (
        <>
            <header style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
                        Brand Profile
                        {brandName && (
                            <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--s2)', padding: '6px 12px', borderRadius: '8px', marginLeft: '12px' }}>
                                🏢 {brandName}
                            </span>
                        )}
                    </h1>
                </div>
            </header>

            {/* Brand Banner */}
            <div style={{ 
                background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))', 
                border: '1px solid var(--border)', 
                borderRadius: '16px', 
                padding: '40px',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ 
                        width: '100px', height: '100px', borderRadius: '24px', 
                        background: 'linear-gradient(135deg, var(--violet), var(--pink))', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '40px', fontWeight: '800', color: '#fff', border: '4px solid rgba(255,255,255,0.2)'
                    }}>
                        {initials}
                    </div>
                    <div>
                        <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>{brandName}</div>
                        <div style={{ fontSize: '14px', color: 'var(--muted2)', marginBottom: '12px' }}>
                            {apiData?.brandProfile?.industry || ""}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--muted)' }}>
                            {apiData?.brandProfile?.location && <span>📍 {apiData.brandProfile.location}</span>}
                            {apiData?.brandProfile?.website && <span>🌐 {apiData.brandProfile.website}</span>}
                            {apiData?.account?.email && <span>📧 {apiData.account.email}</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--violet)' }}>{totalCampaigns}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Campaigns</div>
                </div>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--pink)' }}>{totalCreatorsCount}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Creators</div>
                </div>
                {/* Other stats hidden or set to 0 as they aren't in the provided API schema */}
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--green)' }}>$0</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Total Spent</div>
                </div>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--cyan)' }}>0%</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Avg. Engagement</div>
                </div>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--amber)' }}>0%</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Success Rate</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {['overview', 'campaigns', 'creators', 'reviews'].map(tab => (
                    <div 
                        key={tab}
                        onClick={() => setActiveSection(tab)}
                        style={{ 
                            padding: '10px 20px', 
                            background: activeSection === tab ? 'rgba(139, 92, 246, 0.1)' : 'var(--s2)', 
                            border: '1px solid var(--border)',
                            borderColor: activeSection === tab ? 'var(--violet)' : 'var(--border)',
                            borderRadius: '10px', cursor: 'pointer',
                            color: activeSection === tab ? 'var(--violet)' : 'var(--muted2)',
                            fontWeight: activeSection === tab ? '600' : '500', fontSize: '13px', textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Content Sections */}
            {activeSection === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                        <div style={{ fontWeight: '700', marginBottom: '16px' }}>About {brandName}</div>
                        <p style={{ fontSize: '14px', color: 'var(--muted2)', lineHeight: '1.7' }}>
                            {apiData?.brandProfile?.description || ""}
                        </p>
                    </div>
                </div>
            )}

            {activeSection === 'campaigns' && (
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: '700' }}>Live Projects</div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase' }}>Campaign</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase' }}>Creators</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase' }}>Budget</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px' }}>{item.name}</td>
                                        <td style={{ padding: '16px 24px', color: 'var(--muted2)', fontSize: '13px' }}>
                                            {item.creators?.length || 0} 
                                        </td>
                                        <td style={{ padding: '16px 24px', fontWeight: '600' }}>${item.budget || 0}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeSection === 'creators' && (
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontWeight: '700', marginBottom: '20px' }}>Partnerships</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {allCreators.map((creator, i) => (
                            <div key={i} style={{ padding: '20px', background: 'var(--s2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--s1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                    {creator.avatar}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{creator.name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{creator.handle}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--violet)' }}>{creator.campaigns} campaigns</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'reviews' && (
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontWeight: '700', marginBottom: '20px' }}>Creator Reviews</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {hardcodedReviews.map((review, i) => (
                            <div key={i} style={{ padding: '20px', background: 'var(--s2)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div style={{ fontWeight: '600' }}>{review.creator}</div>
                                    <div style={{ color: 'var(--amber)' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--muted2)', lineHeight: '1.6', marginBottom: '8px' }}>{review.comment}</p>
                                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{review.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}