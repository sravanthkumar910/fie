import { useState } from 'react';

const faqs = [
    { question: 'How do I create a new project?', answer: 'To create a new project, click the "New Project" button on the Projects page. Fill in the project name, budget, number of creators, and select the platform. Once submitted, you can start inviting creators to your project.' },
    { question: 'How do I invite creators to my campaign?', answer: 'Go to the Discover Creators page, browse through the available creators, and click on their profile. You can then send them an invitation directly from their profile page or add them to an existing project.' },
    { question: 'When do payments get processed?', answer: 'Payments are processed within 2-3 business days after you approve the content. You can track all payment statuses in the Payments section of your dashboard.' },
    { question: 'How can I track campaign performance?', answer: 'The Performance page provides comprehensive analytics including impressions, reach, engagement rates, and ROI for all your campaigns. You can filter by date range and platform.' },
    { question: 'What happens if a creator misses a deadline?', answer: 'If a creator misses a deadline, you will receive a notification. You can then message them directly through the Messages section to discuss the situation and agree on a new timeline.' },
    { question: 'How do I cancel or modify an active project?', answer: 'Go to your Projects page, select the project you want to modify, and click on the project details. From there, you can update the project status or cancel it. Note that cancellation policies may apply based on work completed.' },
];

const helpArticles = [
    { title: 'Getting Started with collabstr', icon: '🚀', views: '12.5K' },
    { title: 'Creating Your First Campaign', icon: '📢', views: '8.2K' },
    { title: 'Finding the Right Creators', icon: '🔍', views: '6.8K' },
    { title: 'Managing Payments', icon: '💳', views: '5.4K' },
    { title: 'Understanding Analytics', icon: '📊', views: '4.9K' },
    { title: 'Best Practices for Brands', icon: '✨', views: '3.2K' },
];

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);

    return (
        <>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
                    Help Center
                    <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--s2)', padding: '6px 12px', borderRadius: '8px', marginLeft: '12px' }}>
                        🆘 Get assistance
                    </span>
                </h1>
            </header>

            {/* Search */}
            <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', marginBottom: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>How can we help you?</div>
                <div className="search-container" style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
                    <span>🔍</span>
                    <input 
                        placeholder="Search for help articles, FAQs..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '14px', width: '100%' }}
                    />
                </div>
            </div>

            {/* Quick Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                    { label: 'Getting Started', icon: '🚀', color: '#8B5CF6' },
                    { label: 'Creator Management', icon: '👥', color: '#EC4899' },
                    { label: 'Payments & Billing', icon: '💰', color: '#10B981' },
                    { label: 'Contact Support', icon: '💬', color: '#06B6D4' },
                ].map(item => (
                    <div 
                        key={item.label}
                        onClick={() => item.label === 'Contact Support' && setShowContactModal(true)}
                        style={{ 
                            background: 'var(--s1)', 
                            border: '1px solid var(--border)', 
                            borderRadius: '16px', 
                            padding: '24px',
                            cursor: 'pointer',
                            transition: '0.2s ease',
                            borderTop: `3px solid ${item.color}`
                        }}
                    >
                        <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.label}</div>
                    </div>
                ))}
            </div>

            {/* Popular Articles */}
            <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Popular Articles</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {helpArticles.map((article, i) => (
                        <div 
                            key={i}
                            style={{ 
                                padding: '20px', 
                                background: 'var(--s2)', 
                                borderRadius: '12px', 
                                cursor: 'pointer',
                                transition: '0.2s ease'
                            }}
                        >
                            <div style={{ fontSize: '24px', marginBottom: '12px' }}>{article.icon}</div>
                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>{article.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>👁 {article.views} views</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQs */}
            <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Frequently Asked Questions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {faqs.map((faq, i) => (
                        <div 
                            key={i}
                            style={{ 
                                background: 'var(--s2)', 
                                borderRadius: '12px', 
                                overflow: 'hidden',
                                border: expandedFaq === i ? '1px solid var(--violet)' : '1px solid transparent'
                            }}
                        >
                            <div 
                                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                style={{ 
                                    padding: '16px 20px', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ fontWeight: '600', fontSize: '14px' }}>{faq.question}</div>
                                <div style={{ fontSize: '18px', color: 'var(--muted)', transform: expandedFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}>▼</div>
                            </div>
                            {expandedFaq === i && (
                                <div style={{ padding: '0 20px 20px', fontSize: '13px', color: 'var(--muted2)', lineHeight: '1.6' }}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Modal */}
            {showContactModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }} onClick={() => setShowContactModal(false)}>
                    <div style={{
                        background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', width: '480px', maxWidth: '90%'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Contact Support</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <select style={{ padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }}>
                                <option>Select Topic</option>
                                <option>Account Issues</option>
                                <option>Payment Problems</option>
                                <option>Technical Support</option>
                                <option>Billing Inquiry</option>
                                <option>Other</option>
                            </select>
                            <input placeholder="Subject" style={{ padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} />
                            <textarea 
                                placeholder="Describe your issue in detail..." 
                                rows={5}
                                style={{ padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', resize: 'none' }}
                            />
                            <input type="email" placeholder="Email for response" defaultValue="sravanthkumar@titanfit.com" style={{ padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button onClick={() => setShowContactModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                            <button style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Submit Request</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
