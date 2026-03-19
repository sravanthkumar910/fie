import { useEffect, useState } from 'react';

const tabs = ['Profile', 'Account', 'Notifications', 'Billing', 'Security'];

// Defined default data to show if the Database returns an empty object {}
const defaultSettings = {
    brandProfile: {
        name: "TitanFit Co.",
        plan: "Pro Plan",
        industry: "Fitness & Wellness",
        website: "https://titanfit.com",
        location: "San Francisco, CA",
        description: "TitanFit Co. is a premium fitness and wellness brand dedicated to helping people achieve their health goals through innovative products and community support."
    },
    account: {
        email: "sravanthkumar@titanfit.com",
        phoneNumber: "+1 (555) 123-4567",
        timezone: "Pacific Time (PT)"
    },
    notifications: {
        channels: { email: true, push: true, sms: false },
        activity: { projectUpdates: true, paymentActivity: true, newMessages: true, weeklySummary: true }
    },
    // INTEGRATED SECURITY DEFAULTS
    security: {
        twoFactorEnabled: false,
        loginAlerts: true
    },
    billing: {
        currentPlan: "Pro Plan",
        price: 49,
        billingCycle: "monthly",
        paymentMethod: { cardType: "VISA", lastFour: "4242", expiry: "12/2027" }
    }
};

export default function Settings() {
    const [activeTab, setActiveTab] = useState('Profile');
    const [formData, setFormData] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [savedMessage, setSavedMessage] = useState('');

    // NEW: State for the Billing Edit Modal
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [tempBilling, setTempBilling] = useState(defaultSettings.billing);

    // 1. GET API: Fetch settings from the database
    const fetchSettings = async () => {
        try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
            const data = await response.json();
            
            // If data is {} or empty, we keep the defaultSettings
            if (data && Object.keys(data).length > 0) {
                setFormData(data);
                setTempBilling(data.billing); // Sync modal data
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // 1. Updated handleSave to accept data directly
const handleSave = async (dataToSave, customMsg = 'Settings saved successfully!') => {
    try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/info`, {
            method: 'POST', // Matches your requirement for the POST API
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave) // Use the data passed to the function
        });

        if (response.ok) {
            showSaveMessage(customMsg);
            await fetchSettings(); // Refresh from DB to confirm update
        }
    } catch (error) {
        console.error("Error updating settings:", error);
    }
};

// 2. Updated notification toggle logic
const updateNotificationState = (subSection, field) => {
    // Calculate the new state first
    const updatedData = {
        ...formData,
        notifications: {
            ...formData.notifications,
            [subSection]: {
                ...formData.notifications[subSection],
                [field]: !formData.notifications[subSection][field]
            }
        }
    };

    // Update local UI state
    setFormData(updatedData);

    // IMMEDIATELY push the calculated new state to the DB
    handleSave(updatedData, 'Notification preference updated!');
};

// NEW: Updated security toggle logic for 2FA and Login Alerts
const updateSecurityState = (field) => {
    const updatedData = {
        ...formData,
        security: {
            ...formData.security,
            [field]: !formData.security[field]
        }
    };
    setFormData(updatedData);
    handleSave(updatedData, 'Security settings updated!');
};

    const showSaveMessage = (msg) => {
        setSavedMessage(msg);
        setTimeout(() => setSavedMessage(''), 3000);
    };

    // Helper to update nested state objects
    const updateNestedState = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // NEW: Handle Saving Billing Info from Modal
    const handleBillingUpdate = async () => {
        const updatedData = {
            ...formData,
            billing: tempBilling
        };
        await handleSave(updatedData, 'Billing information updated!');
        setShowBillingModal(false);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Settings...</div>;

    return (
        <>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
                    Settings
                    <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--s2)', padding: '6px 12px', borderRadius: '8px', marginLeft: '12px' }}>
                        ⚙️ Manage your account
                    </span>
                </h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '12px' }}>
                    {tabs.map(tab => (
                        <div 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ 
                                padding: '14px 16px', 
                                borderRadius: '10px', 
                                cursor: 'pointer',
                                background: activeTab === tab ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === tab ? 'var(--violet)' : 'var(--muted2)',
                                fontWeight: activeTab === tab ? '600' : '500',
                                fontSize: '14px',
                                marginBottom: '4px'
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
                    {activeTab === 'Profile' && (
                        <>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Brand Profile</h2>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800', color: '#fff' }}>
                                    {formData.brandProfile.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{formData.brandProfile.name}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--muted2)', marginBottom: '12px' }}>Brand Account · {formData.brandProfile.plan}</div>
                                    <button onClick={() => showSaveMessage('Logo updated successfully!')} style={{ padding: '8px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '13px', cursor: 'pointer' }}>Change Logo</button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted2)' }}>Brand Name</label>
                                    <input 
                                        value={formData.brandProfile.name} 
                                        onChange={(e) => updateNestedState('brandProfile', 'name', e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted2)' }}>Industry</label>
                                    <select 
                                        value={formData.brandProfile.industry}
                                        onChange={(e) => updateNestedState('brandProfile', 'industry', e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }}
                                    >
                                        <option>Fitness & Wellness</option>
                                        <option>Beauty</option>
                                        <option>Technology</option>
                                        <option>Food & Beverage</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted2)' }}>Website</label>
                                    <input 
                                        value={formData.brandProfile.website} 
                                        onChange={(e) => updateNestedState('brandProfile', 'website', e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted2)' }}>Location</label>
                                    <input 
                                        value={formData.brandProfile.location} 
                                        onChange={(e) => updateNestedState('brandProfile', 'location', e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} 
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted2)' }}>Description</label>
                                    <textarea 
                                        rows={3} 
                                        value={formData.brandProfile.description} 
                                        onChange={(e) => updateNestedState('brandProfile', 'description', e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', resize: 'none' }} 
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                                <button onClick={() => handleSave(formData, 'Profile saved successfully!')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Save Changes</button>
                                <button onClick={fetchSettings} style={{ padding: '12px 24px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                            </div>
                            {savedMessage && <div style={{ marginTop: '12px', padding: '10px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--green)', borderRadius: '8px', color: 'var(--green)', fontSize: '13px' }}>{savedMessage}</div>}
                        </>
                    )}

                    {activeTab === 'Notifications' && (
                        <>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Notification Preferences</h2>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--muted2)' }}>Notification Channels</div>
                                {[
                                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                                    { key: 'push', label: 'Push Notifications', desc: 'Get instant notifications on your device' },
                                    { key: 'sms', label: 'SMS Notifications', desc: 'Receive text messages for important updates' },
                                ].map(item => (
                                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--s2)', borderRadius: '12px', marginBottom: '12px' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.label}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.desc}</div>
                                        </div>
                                        <button 
                                            onClick={() => { updateNotificationState('channels', item.key); }}
                                            style={{ 
                                                width: '48px', 
                                                height: '28px', 
                                                borderRadius: '14px', 
                                                background: formData.notifications.channels[item.key] ? 'var(--violet)' : 'var(--s3)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ 
                                                width: '22px', 
                                                height: '22px', 
                                                borderRadius: '50%', 
                                                background: '#fff',
                                                position: 'absolute',
                                                top: '3px',
                                                left: formData.notifications.channels[item.key] ? '23px' : '3px',
                                                transition: '0.2s'
                                            }}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--muted2)' }}>Activity Notifications</div>
                                {[
                                    { key: 'projectUpdates', label: 'Project Updates', desc: 'When projects have status changes' },
                                    { key: 'paymentActivity', label: 'Payment Activity', desc: 'Payment sent, received, or failed' },
                                    { key: 'newMessages', label: 'New Messages', desc: 'When you receive new messages' },
                                    { key: 'weeklySummary', label: 'Weekly Summary', desc: 'Weekly performance digest' },
                                ].map(item => (
                                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--s2)', borderRadius: '12px', marginBottom: '12px' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.label}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.desc}</div>
                                        </div>
                                        <button 
                                            onClick={() => { updateNotificationState('activity', item.key); }}
                                            style={{ 
                                                width: '48px', 
                                                height: '28px', 
                                                borderRadius: '14px', 
                                                background: formData.notifications.activity[item.key] ? 'var(--violet)' : 'var(--s3)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ 
                                                width: '22px', 
                                                height: '22px', 
                                                borderRadius: '50%', 
                                                background: '#fff',
                                                position: 'absolute',
                                                top: '3px',
                                                left: formData.notifications.activity[item.key] ? '23px' : '3px',
                                                transition: '0.2s'
                                            }}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {savedMessage && <div style={{ marginTop: '12px', padding: '10px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--green)', borderRadius: '8px', color: 'var(--green)', fontSize: '13px' }}>{savedMessage}</div>}
                        </>
                    )}

                    {activeTab === 'Account' && (
                        <>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Account Settings</h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted2)' }}>Email Address</label>
                                    <input 
                                        value={formData.account.email} 
                                        onChange={(e) => updateNestedState('account', 'email', e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted2)' }}>Phone Number</label>
                                    <input 
                                        value={formData.account.phoneNumber} 
                                        onChange={(e) => updateNestedState('account', 'phoneNumber', e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted2)' }}>Timezone</label>
                                    <select 
                                        value={formData.account.timezone}
                                        onChange={(e) => updateNestedState('account', 'timezone', e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }}
                                    >
                                        <option>Pacific Time (PT)</option>
                                        <option>Mountain Time (MT)</option>
                                        <option>Central Time (CT)</option>
                                        <option>Eastern Time (ET)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                                <button onClick={() => handleSave(formData, 'Account settings saved successfully!')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Save Changes</button>
                            </div>
                            {savedMessage && <div style={{ marginTop: '12px', padding: '10px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--green)', borderRadius: '8px', color: 'var(--green)', fontSize: '13px' }}>{savedMessage}</div>}
                        </>
                    )}

                    {activeTab === 'Billing' && (
                        <>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Billing & Subscription</h2>
                            
                            <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))', border: '1px solid var(--violet)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted2)', marginBottom: '4px' }}>Current Plan</div>
                                        <div style={{ fontSize: '24px', fontWeight: '800' }}>{formData.billing.currentPlan}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>${formData.billing.price}/month · Billed {formData.billing.billingCycle}</div>
                                    </div>
                                    <button onClick={() => setShowBillingModal(true)} style={{ padding: '10px 20px', background: '#fff', border: 'none', borderRadius: '10px', color: 'var(--violet)', fontWeight: '700', cursor: 'pointer' }}>Upgrade</button>
                                </div>
                            </div>

                            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--muted2)' }}>Payment Method</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: 'var(--s2)', borderRadius: '12px', marginBottom: '24px' }}>
                                <div style={{ width: '48px', height: '32px', background: 'linear-gradient(135deg, #1a1f71, #0066b2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff' }}>{formData.billing.paymentMethod.cardType}</div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>•••• •••• •••• {formData.billing.paymentMethod.lastFour}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Expires {formData.billing.paymentMethod.expiry}</div>
                                </div>
                                <button onClick={() => setShowBillingModal(true)} style={{ marginLeft: 'auto', padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted2)', fontSize: '13px', cursor: 'pointer' }}>Update</button>
                            </div>
                        </>
                    )}

                    {activeTab === 'Security' && (
                        <>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Security Settings</h2>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--muted2)' }}>Change Password</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <input type="password" placeholder="Current password" style={{ padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} />
                                    <input type="password" placeholder="New password" style={{ padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} />
                                    <input type="password" placeholder="Confirm new password" style={{ padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none' }} />
                                </div>
                                <button onClick={() => showSaveMessage('Password updated successfully!')} style={{ marginTop: '16px', padding: '12px 24px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', cursor: 'pointer' }}>Update Password</button>
                            </div>

                            <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--muted2)' }}>Security Preferences</div>
                                
                                {/* DYNAMIC SECURITY TOGGLE: 2FA */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'var(--s2)', borderRadius: '12px', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>Enable 2FA</div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Add an extra layer of security to your account</div>
                                    </div>
                                    <button 
                                        onClick={() => updateSecurityState('twoFactorEnabled')}
                                        style={{ 
                                            width: '48px', 
                                            height: '28px', 
                                            borderRadius: '14px', 
                                            background: formData.security?.twoFactorEnabled ? 'var(--violet)' : 'var(--s3)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ 
                                            width: '22px', 
                                            height: '22px', 
                                            borderRadius: '50%', 
                                            background: '#fff',
                                            position: 'absolute',
                                            top: '3px',
                                            left: formData.security?.twoFactorEnabled ? '23px' : '3px',
                                            transition: '0.2s'
                                        }}></div>
                                    </button>
                                </div>

                                {/* DYNAMIC SECURITY TOGGLE: Login Alerts */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'var(--s2)', borderRadius: '12px' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>Login Alerts</div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Get notified of new login attempts</div>
                                    </div>
                                    <button 
                                        onClick={() => updateSecurityState('loginAlerts')}
                                        style={{ 
                                            width: '48px', 
                                            height: '28px', 
                                            borderRadius: '14px', 
                                            background: formData.security?.loginAlerts ? 'var(--violet)' : 'var(--s3)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ 
                                            width: '22px', 
                                            height: '22px', 
                                            borderRadius: '50%', 
                                            background: '#fff',
                                            position: 'absolute',
                                            top: '3px',
                                            left: formData.security?.loginAlerts ? '23px' : '3px',
                                            transition: '0.2s'
                                        }}></div>
                                    </button>
                                </div>
                            </div>
                            {savedMessage && <div style={{ marginTop: '12px', padding: '10px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--green)', borderRadius: '8px', color: 'var(--green)', fontSize: '13px' }}>{savedMessage}</div>}
                        </>
                    )}
                </div>
            </div>

            {/* BILLING UPDATE MODAL */}
            {showBillingModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowBillingModal(false)}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', width: '500px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Update Billing Info</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Select Plan</label>
                                <select 
                                    value={tempBilling.currentPlan}
                                    onChange={(e) => setTempBilling({...tempBilling, currentPlan: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }}
                                >
                                    <option value="Free">Free</option>
                                    <option value="Pro Plan">Pro Plan</option>
                                    <option value="Enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Price ($)</label>
                                <input 
                                    type="number"
                                    value={tempBilling.price}
                                    onChange={(e) => setTempBilling({...tempBilling, price: parseInt(e.target.value)})}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Card Type</label>
                                    <input 
                                        value={tempBilling.paymentMethod.cardType}
                                        onChange={(e) => setTempBilling({...tempBilling, paymentMethod: {...tempBilling.paymentMethod, cardType: e.target.value}})}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Last 4 Digits</label>
                                    <input 
                                        value={tempBilling.paymentMethod.lastFour}
                                        onChange={(e) => setTempBilling({...tempBilling, paymentMethod: {...tempBilling.paymentMethod, lastFour: e.target.value}})}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button onClick={() => setShowBillingModal(false)} style={{ flex: 1, padding: '12px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleBillingUpdate} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}