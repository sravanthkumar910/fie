import { useState } from 'react';

const conversations = [
    { id: 1, name: 'Maya Chen', handle: '@mayaglows', lastMessage: 'Sure, I can send you the content by tomorrow!', time: '2 min ago', avatar: '🧖', unread: 2, platform: 'Instagram', project: 'Summer Skincare Launch' },
    { id: 2, name: 'Jordan Reeves', handle: '@fitwithjordan', lastMessage: 'The video is ready for review 🎬', time: '15 min ago', avatar: '🏋️', unread: 1, platform: 'TikTok', project: 'Fitness Collab Series' },
    { id: 3, name: 'Priya Nair', handle: '@priyastyle', lastMessage: 'Thanks for the opportunity!', time: '1 hr ago', avatar: '📸', unread: 0, platform: 'Instagram', project: 'Holiday Gift Guide' },
    { id: 4, name: 'David Kim', handle: '@techwithdavid', lastMessage: 'Can we schedule a call to discuss?', time: '3 hrs ago', avatar: '💻', unread: 0, platform: 'YouTube', project: 'Tech Review Campaign' },
    { id: 5, name: 'Sophie Turner', handle: '@sophiestravels', lastMessage: 'The photos look amazing! 📸', time: 'Yesterday', avatar: '✈️', unread: 0, platform: 'Instagram', project: 'Travel Vlog Collab' },
    { id: 6, name: 'Emma Rodriguez', handle: '@emmcooks', lastMessage: 'Recipe video is being edited now', time: 'Yesterday', avatar: '👩‍🍳', unread: 0, platform: 'YouTube', project: 'Food & Recipe Series' },
    { id: 7, name: 'Marcus Johnson', handle: '@marcusfits', lastMessage: 'Let me know if you need any changes', time: '2 days ago', avatar: '💪', unread: 0, platform: 'TikTok', project: 'Fitness Collab Series' },
];

const messageHistory = {
    1: [
        { id: 1, sender: 'them', text: 'Hi! I saw your project requirements for the Summer Skincare Launch. Very excited to collaborate!', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Hello Maya! Thanks for reaching out. We loved your portfolio. Can you share some examples of your previous skincare content?', time: '10:32 AM' },
        { id: 3, sender: 'them', text: 'Of course! Here are some links to my recent posts - I have done campaigns for major skincare brands like CeraVe and The Ordinary.', time: '10:35 AM' },
        { id: 4, sender: 'them', text: 'I also have a highlight reel on my profile with more content samples.', time: '10:36 AM' },
        { id: 5, sender: 'me', text: 'Great! The quality looks amazing. What is your availability for a call this week?', time: '10:40 AM' },
        { id: 6, sender: 'them', text: 'I am free on Wednesday or Friday afternoon. Would either work for you?', time: '10:42 AM' },
        { id: 7, sender: 'me', text: 'Wednesday works perfectly. I will send you a calendar invite.', time: '10:45 AM' },
        { id: 8, sender: 'them', text: 'Sure, I can send you the content by tomorrow!', time: '10:48 AM' },
    ],
    2: [
        { id: 1, sender: 'them', text: 'Hey! Just finished filming the fitness challenge video', time: '9:00 AM' },
        { id: 2, sender: 'me', text: 'Awesome! Cannot wait to see it 🔥', time: '9:15 AM' },
        { id: 3, sender: 'them', text: 'The video is ready for review 🎬', time: '9:30 AM' },
    ],
    3: [
        { id: 1, sender: 'them', text: 'Thank you so much for this opportunity!', time: '2:00 PM' },
        { id: 2, sender: 'me', text: 'Thank YOU for joining our campaign! We really appreciate your work.', time: '2:15 PM' },
        { id: 3, sender: 'them', text: 'Thanks for the opportunity!', time: '2:30 PM' },
    ],
    4: [
        { id: 1, sender: 'them', text: 'Hi! I would like to discuss the project details', time: '11:00 AM' },
        { id: 2, sender: 'me', text: 'Of course! What would you like to know?', time: '11:15 AM' },
        { id: 3, sender: 'them', text: 'Can we schedule a call to discuss?', time: '11:30 AM' },
    ],
    5: [
        { id: 1, sender: 'them', text: 'Just uploaded the photos from our collaboration!', time: '5:00 PM' },
        { id: 2, sender: 'them', text: 'The photos look amazing! 📸', time: '5:15 PM' },
    ],
    6: [
        { id: 1, sender: 'them', text: 'Working on the recipe video now!', time: '3:00 PM' },
        { id: 2, sender: 'them', text: 'Recipe video is being edited now', time: '4:30 PM' },
    ],
    7: [
        { id: 1, sender: 'them', text: 'I have made the changes you requested', time: '1:00 PM' },
        { id: 2, sender: 'them', text: 'Let me know if you need any changes', time: '1:30 PM' },
    ],
};

export default function Messages() {
    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [localMessages, setLocalMessages] = useState(messageHistory);
    const [showCallModal, setShowCallModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const filteredConversations = conversations.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentMessages = localMessages[selectedConversation.id] || [];

    const handleSendMessage = () => {
        if (messageText.trim()) {
            const newMessage = {
                id: currentMessages.length + 1,
                sender: 'me',
                text: messageText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setLocalMessages({
                ...localMessages,
                [selectedConversation.id]: [...currentMessages, newMessage]
            });
            setMessageText('');
        }
    };

    const handleCallClick = () => {
        setShowCallModal(true);
    };

    const handleVideoClick = () => {
        setShowVideoModal(true);
    };

    return (
        <>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
                    Messages
                    <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--s2)', padding: '6px 12px', borderRadius: '8px', marginLeft: '12px' }}>
                        💬 {conversations.reduce((acc, c) => acc + c.unread, 0)} Unread
                    </span>
                </h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '16px', height: 'calc(100vh - 160px)' }}>
                {/* Conversations List */}
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div className="search-container">
                            <span>🔍</span>
                            <input 
                                placeholder="Search messages..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '13px', width: '100%' }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredConversations.map(conversation => (
                            <div 
                                key={conversation.id}
                                onClick={() => setSelectedConversation(conversation)}
                                style={{ 
                                    padding: '16px 20px', 
                                    borderBottom: '1px solid var(--border)', 
                                    cursor: 'pointer',
                                    background: selectedConversation.id === conversation.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                    borderLeft: selectedConversation.id === conversation.id ? '3px solid var(--violet)' : '3px solid transparent'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                            {conversation.avatar}
                                        </div>
                                        {conversation.unread > 0 && (
                                            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '18px', height: '18px', background: 'var(--pink)', borderRadius: '50%', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                                {conversation.unread}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{conversation.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{conversation.time}</div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {conversation.lastMessage}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Chat Header */}
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                {selectedConversation.avatar}
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '15px' }}>{selectedConversation.name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--muted2)' }}>{selectedConversation.handle} · {selectedConversation.project}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleCallClick} style={{ width: '36px', height: '36px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>📞</button>
                            <button onClick={handleVideoClick} style={{ width: '36px', height: '36px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>🎥</button>
                            <button style={{ width: '36px', height: '36px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>ℹ️</button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {currentMessages.map(message => (
                            <div key={message.id} style={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                                <div style={{ 
                                    maxWidth: '70%', 
                                    padding: '14px 18px', 
                                    borderRadius: '16px',
                                    background: message.sender === 'me' ? 'linear-gradient(135deg, var(--violet), var(--pink))' : 'var(--s2)',
                                    borderBottomRightRadius: message.sender === 'me' ? '4px' : '16px',
                                    borderBottomLeftRadius: message.sender === 'them' ? '4px' : '16px'
                                }}>
                                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{message.text}</div>
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', padding: '0 8px' }}>
                                    {message.time}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button style={{ width: '40px', height: '40px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontSize: '16px' }}>📎</button>
                        <button style={{ width: '40px', height: '40px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontSize: '16px' }}>🖼️</button>
                        <input 
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            style={{ 
                                flex: 1, 
                                padding: '12px 18px', 
                                background: 'var(--s2)', 
                                border: '1px solid var(--border)', 
                                borderRadius: '12px', 
                                color: 'var(--text)', 
                                fontSize: '14px', 
                                outline: 'none' 
                            }}
                        />
                        <button 
                            onClick={handleSendMessage}
                            style={{ 
                                width: '44px', 
                                height: '44px', 
                                background: 'linear-gradient(135deg, var(--violet), var(--pink))', 
                                border: 'none', 
                                borderRadius: '12px', 
                                cursor: 'pointer', 
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            </div>

            {/* Call Modal */}
            {showCallModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowCallModal(false)}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '20px', padding: '40px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>
                            {selectedConversation.avatar}
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Calling {selectedConversation.name}...</h2>
                        <p style={{ fontSize: '14px', color: 'var(--muted2)', marginBottom: '24px' }}>Connecting via audio call</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setShowCallModal(false)} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--red)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>📴</button>
                            <button style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--s2)', border: '1px solid var(--border)', fontSize: '20px', cursor: 'pointer' }}>🔇</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Call Modal */}
            {showVideoModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowVideoModal(false)}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '20px', padding: '40px', textAlign: 'center', width: '500px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ width: '120px', height: '80px', borderRadius: '12px', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>
                            🎥
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Video Call with {selectedConversation.name}</h2>
                        <p style={{ fontSize: '14px', color: 'var(--muted2)', marginBottom: '24px' }}>Starting video conference...</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setShowVideoModal(false)} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--red)', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>📴</button>
                            <button style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--s2)', border: '1px solid var(--border)', fontSize: '20px', cursor: 'pointer' }}>📷</button>
                            <button style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--s2)', border: '1px solid var(--border)', fontSize: '20px', cursor: 'pointer' }}>🎤</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
