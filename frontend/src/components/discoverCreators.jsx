import { useEffect, useState } from 'react';

const creators = [
    { id: 1, name: 'Maya Chen', handle: '@mayaglows', followers: '2.1M', engagement: '8.4%', rate: '$2,500', platforms: ['📸', '🎵', '▶️'], niche: 'Skincare & Beauty', avatar: '🧖', verified: true, bio: 'Skincare enthusiast and beauty content creator with 5+ years of experience.', email: 'maya@example.com', location: 'Los Angeles, CA', campaigns: 47 },
    { id: 2, name: 'Jordan Reeves', handle: '@fitwithjordan', followers: '870K', engagement: '11.2%', rate: '$1,800', platforms: ['🎵', '📸'], niche: 'Fitness & Health', avatar: '🏋️', verified: true, bio: 'Certified fitness trainer and wellness coach. Creating transformative content.', email: 'jordan@example.com', location: 'Miami, FL', campaigns: 32 },
    { id: 3, name: 'Priya Nair', handle: '@priyastyle', followers: '540K', engagement: '6.7%', rate: '$1,200', platforms: ['📸', '🐦'], niche: 'Fashion & Lifestyle', avatar: '📸', verified: true, bio: 'Fashion blogger and style influencer. Trendsetter in the industry.', email: 'priya@example.com', location: 'New York, NY', campaigns: 28 },
    { id: 4, name: 'Sam Williams', handle: '@samwellness', followers: '310K', engagement: '9.1%', rate: '$900', platforms: ['▶️', '📸'], niche: 'Wellness & Yoga', avatar: '🌿', verified: false, bio: 'Yoga instructor and wellness advocate. Mind-body connection enthusiast.', email: 'sam@example.com', location: 'San Francisco, CA', campaigns: 15 },
    { id: 5, name: 'Alex Park', handle: '@alexcreates', followers: '198K', engagement: '14.3%', rate: '$750', platforms: ['🎵', '📸'], niche: 'Art & Creative', avatar: '🎨', verified: false, bio: 'Digital artist and creative content creator. Always thinking outside the box.', email: 'alex@example.com', location: 'Seattle, WA', campaigns: 12 },
    { id: 6, name: 'Emma Davis', handle: '@emm travels', followers: '420K', engagement: '7.8%', rate: '$1,500', platforms: ['📸', '▶️'], niche: 'Travel & Adventure', avatar: '✈️', verified: true, bio: 'Adventure traveler documenting her journeys around the world.', email: 'emma@example.com', location: 'Denver, CO', campaigns: 24 },
    { id: 7, name: 'Marcus Chen', handle: '@marcustech', followers: '156K', engagement: '12.5%', rate: '$600', platforms: ['🐦', '📸'], niche: 'Tech & Gaming', avatar: '💻', verified: false, bio: 'Tech reviewer and gaming streamer. Breaking down the latest gadgets.', email: 'marcus@example.com', location: 'Austin, TX', campaigns: 8 },
    { id: 8, name: 'Sophie Miller', handle: '@sophfoodie', followers: '680K', engagement: '8.9%', rate: '$1,600', platforms: ['📸', '▶️'], niche: 'Food & Cooking', avatar: '🍳', verified: true, bio: 'Professional chef and food content creator. Love sharing recipes!', email: 'sophie@example.com', location: 'Chicago, IL', campaigns: 35 },
];

export default function DiscoverCreators({ projects, onInvite }) {
    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState('All');
    const [nicheFilter, setNicheFilter] = useState('All');
    const [savedCreators, setSavedCreators] = useState([]);
    const [showSaved, setShowSaved] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteSent, setInviteSent] = useState(false);
    const [inviteData, setInviteData] = useState({ project: '', amount: '', message: '' });
    const [projectNames, setProjectNames] = useState([]);

    const platforms = ['All', 'Instagram', 'TikTok', 'YouTube', 'Twitter'];
    const niches = ['All', 'Skincare & Beauty', 'Fitness & Health', 'Fashion & Lifestyle', 'Wellness & Yoga', 'Art & Creative', 'Travel & Adventure', 'Tech & Gaming', 'Food & Cooking'];

    const filteredCreators = creators.filter(creator => {
        const matchesSearch = creator.name.toLowerCase().includes(search.toLowerCase()) || 
                            creator.handle.toLowerCase().includes(search.toLowerCase());
        const matchesPlatform = platformFilter === 'All' || 
            (platformFilter === 'Instagram' && creator.platforms.includes('📸')) ||
            (platformFilter === 'TikTok' && creator.platforms.includes('🎵')) ||
            (platformFilter === 'YouTube' && creator.platforms.includes('▶️')) ||
            (platformFilter === 'Twitter' && creator.platforms.includes('🐦'));
        const matchesNiche = nicheFilter === 'All' || creator.niche === nicheFilter;
        return matchesSearch && matchesPlatform && matchesNiche;
    });

    const toggleSaveCreator = (id) => {
        if (savedCreators.includes(id)) {
            setSavedCreators(savedCreators.filter(c => c !== id));
        } else {
            setSavedCreators([...savedCreators, id]);
        }
    };

    const displayedCreators = showSaved 
        ? creators.filter(c => savedCreators.includes(c.id))
        : filteredCreators;

    const openCreatorProfile = (creator) => {
        setSelectedCreator(creator);
        setShowProfileModal(true);
    };

    const openInviteModal = (creator) => {
        setSelectedCreator(creator);
        // Use the first name from the fetched projectNames as the default project
        const defaultProject = projectNames && projectNames.length > 0 ? projectNames[0] : 'Summer Skincare Launch';
        setInviteData({ 
            project: defaultProject, 
            amount: creator.rate, 
            message: `Hi! We'd love to collaborate with you on our ${defaultProject}!` 
        });
        setInviteSent(false);
        setShowInviteModal(true);
    };

    const handleSendInvite = () => {
        if (onInvite) {
            onInvite({
                id: Date.now(),
                creator: selectedCreator.name,
                creatorHandle: selectedCreator.handle,
                project: inviteData.project,
                amount: inviteData.amount,
                message: inviteData.message,
                status: 'Pending',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });
        }
        setInviteSent(true);
    };

    // Corrected useEffect to fetch project names from backend
    useEffect(() => {
        const getNames = async () => {
            try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/project-names`);
                const data = await response.json();
                setProjectNames(data);
            } catch (error) {
                console.error('Error fetching project names:', error);
            }
        };
        getNames();
    }, []);

    return (
        <>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
                    Discover Creators
                    <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--s2)', padding: '6px 12px', borderRadius: '8px', marginLeft: '12px' }}>
                        🔍 Find the perfect creators for your brand
                    </span>
                </h1>
                <p style={{ color: 'var(--muted2)', fontSize: '14px' }}>Browse through {creators.length}+ verified creators across multiple niches</p>
            </header>

            <div className="filter-row">
                <div className="search-container" style={{ width: '320px' }}>
                    <span>🔍</span>
                    <input 
                        placeholder="Search creators..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select 
                    className="filter-chip" 
                    style={{ background: platformFilter !== 'All' ? 'rgba(139, 92, 246, 0.1)' : 'var(--s2)', borderColor: platformFilter !== 'All' ? 'var(--violet)' : 'var(--border)', color: platformFilter !== 'All' ? 'var(--violet)' : 'var(--muted2)' }}
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                >
                    {platforms.map(p => <option key={p} value={p}>{p === 'All' ? 'All Platforms' : p}</option>)}
                </select>

                <select 
                    className="filter-chip" 
                    style={{ background: nicheFilter !== 'All' ? 'rgba(139, 92, 246, 0.1)' : 'var(--s2)', borderColor: nicheFilter !== 'All' ? 'var(--violet)' : 'var(--border)', color: nicheFilter !== 'All' ? 'var(--violet)' : 'var(--muted2)' }}
                    value={nicheFilter}
                    onChange={(e) => setNicheFilter(e.target.value)}
                >
                    {niches.map(n => <option key={n} value={n}>{n === 'All' ? 'All Niches' : n}</option>)}
                </select>

                <button 
                    onClick={() => setShowSaved(!showSaved)}
                    className="filter-chip"
                    style={{ background: showSaved ? 'rgba(236, 72, 153, 0.1)' : 'var(--s2)', borderColor: showSaved ? 'var(--pink)' : 'var(--border)', color: showSaved ? 'var(--pink)' : 'var(--muted2)', cursor: 'pointer', border: '1px solid' }}
                >
                    ❤️ Saved ({savedCreators.length})
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {displayedCreators.map(creator => (
                    <div key={creator.id} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', position: 'relative' }}>
                        <button 
                            onClick={() => toggleSaveCreator(creator.id)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                        >
                            {savedCreators.includes(creator.id) ? '❤️' : '🤍'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                {creator.avatar}
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {creator.name}
                                    {creator.verified && <span style={{ color: 'var(--cyan)' }}>✓</span>}
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--muted2)' }}>{creator.handle}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Followers</div>
                                <div style={{ fontWeight: '700', fontSize: '14px' }}>{creator.followers}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Engagement</div>
                                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--green)' }}>{creator.engagement}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Rate</div>
                                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--violet)' }}>{creator.rate}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Platforms</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {creator.platforms.map((p, i) => (
                                    <span key={i} style={{ width: '28px', height: '28px', background: 'var(--s2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{p}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <span style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--violet)', borderRadius: '20px' }}>
                                {creator.niche}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => openInviteModal(creator)} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                                Invite to Project
                            </button>
                            <button onClick={() => openCreatorProfile(creator)} style={{ padding: '10px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', cursor: 'pointer' }}>
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {displayedCreators.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No creators found</div>
                    <div style={{ fontSize: '14px' }}>Try adjusting your filters or search query</div>
                </div>
            )}

            {/* Creator Profile Modal */}
            {showProfileModal && selectedCreator && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowProfileModal(false)}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', width: '550px', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                                    {selectedCreator.avatar}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {selectedCreator.name}
                                        {selectedCreator.verified && <span style={{ color: 'var(--cyan)' }}>✓</span>}
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--muted2)' }}>{selectedCreator.handle}</div>
                                    <div style={{ marginTop: '8px' }}>
                                        <span style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--violet)', borderRadius: '20px' }}>
                                            {selectedCreator.niche}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setShowProfileModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>

                        <p style={{ fontSize: '14px', color: 'var(--muted2)', marginBottom: '24px', lineHeight: '1.6' }}>
                            {selectedCreator.bio}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ background: 'var(--s2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800' }}>{selectedCreator.followers}</div>
                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Followers</div>
                            </div>
                            <div style={{ background: 'var(--s2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--green)' }}>{selectedCreator.engagement}</div>
                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Engagement</div>
                            </div>
                            <div style={{ background: 'var(--s2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--violet)' }}>{selectedCreator.rate}</div>
                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Starting Rate</div>
                            </div>
                            <div style={{ background: 'var(--s2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800' }}>{selectedCreator.campaigns}</div>
                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Campaigns</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Platforms</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {selectedCreator.platforms.map((p, i) => (
                                    <span key={i} style={{ width: '36px', height: '36px', background: 'var(--s2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{p}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--s2)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>📍 Location</div>
                            <div style={{ fontSize: '14px' }}>{selectedCreator.location}</div>
                            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '12px', marginBottom: '8px' }}>📧 Email</div>
                            <div style={{ fontSize: '14px' }}>{selectedCreator.email}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => { setShowProfileModal(false); openInviteModal(selectedCreator); }} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                                Invite to Project
                            </button>
                            <button onClick={() => toggleSaveCreator(selectedCreator.id)} style={{ padding: '14px 20px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontSize: '20px' }}>
                                {savedCreators.includes(selectedCreator.id) ? '❤️' : '🤍'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite to Project Modal */}
            {showInviteModal && selectedCreator && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowInviteModal(false)}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', width: '480px' }} onClick={e => e.stopPropagation()}>
                        {!inviteSent ? (
                            <>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Invite {selectedCreator.name}</h2>
                                <p style={{ fontSize: '14px', color: 'var(--muted2)', marginBottom: '24px' }}>Send an invitation to collaborate on a project</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--s2)', borderRadius: '12px', marginBottom: '20px' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--s1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                        {selectedCreator.avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{selectedCreator.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{selectedCreator.handle}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Select Project</label>
                                        <select 
                                            value={inviteData.project}
                                            onChange={(e) => setInviteData({...inviteData, project: e.target.value})}
                                            style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }}
                                        >
                                            {/* Logic updated to use projectNames state (array of strings) */}
                                            {projectNames && projectNames.length > 0 ? (
                                                projectNames.map((name, index) => (
                                                    <option key={index} value={name}>{name}</option>
                                                ))
                                            ) : (
                                                <option disabled>No projects found</option>
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Offer Amount</label>
                                        <input 
                                            value={inviteData.amount}
                                            onChange={(e) => setInviteData({...inviteData, amount: e.target.value})}
                                            style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Message</label>
                                        <textarea 
                                            value={inviteData.message}
                                            onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                                            rows={4} 
                                            style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', resize: 'none' }} 
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                    <button onClick={() => setShowInviteModal(false)} style={{ flex: 1, padding: '12px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={handleSendInvite} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Send Invite</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
                                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Invitation Sent!</h2>
                                <p style={{ fontSize: '14px', color: 'var(--muted2)', marginBottom: '24px' }}>
                                    Your invitation has been sent to {selectedCreator.name} for the project "{inviteData.project}"
                                </p>
                                <button onClick={() => setShowInviteModal(false)} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}