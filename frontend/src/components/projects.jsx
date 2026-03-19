import { useEffect, useState } from 'react';

const statusColors = {
    'Live': { bg: 'rgba(16,185,129,0.1)', color: 'var(--green)' },
    'Review': { bg: 'rgba(245,158,11,0.1)', color: 'var(--amber)' },
    'Draft': { bg: 'rgba(107,105,136,0.1)', color: 'var(--muted)' },
    'Planning': { bg: 'rgba(139,92,246,0.1)', color: 'var(--violet)' },
};

export default function Projects({ projects: initialProjects, onAddProject }) {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [showAddCreatorModal, setShowAddCreatorModal] = useState(false);
    const [manageStatus, setManageStatus] = useState('');
    const [manageProgress, setManageProgress] = useState(0);
    const [newProject, setNewProject] = useState({ name: '', budget: '', deadline: '', description: '', platforms: '' });
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeProjectCount, setActiveProjectsCount] = useState(0);

    // Form state for adding creators inside the Manage box
    const [creatorName, setCreatorName] = useState('');
    const [creatorEmail, setCreatorEmail] = useState('');

    const filters = ['All', 'Live', 'Review', 'Draft', 'Planning'];
    const availableDeliverables = ['Instagram Post', 'TikTok Videos', 'Youtube Shorts', 'Facebook'];

    // Function to call the GET ALL API
    const fetchProjects = async () => {
        try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const displayedProjects = initialProjects && initialProjects.length > 0 ? initialProjects : projects;

    const filteredProjects = filter === 'All' 
        ? displayedProjects 
        : displayedProjects.filter(p => p.status === filter);

    const totalBudget = displayedProjects.reduce((sum, p) => sum + parseInt(p.budget.toString().replace(/[^0-9]/g, '') || 0), 0);
    const activeProjects = displayedProjects.filter(p => p.status === 'Live').length;

    const handleAddProject = async () => {
        if (!newProject.name || !newProject.budget) return;
        try {
            const newProjectData = {
                ...newProject,
                creators: [{ name: "N. Sravanth Kumar", email: "contact@titanfit.com" }],
                deliverables: ["Initial Setup"] 
            };

const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/new-project`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProjectData),
            });

            if (response.ok) {
                setShowModal(false);
                setNewProject({ name: '', budget: '', deadline: '', description: '', platforms: '' });
                await fetchProjects(); 
            }
        } catch (error) {
            console.error("Failed to add project:", error);
        }
    };

    // UPDATE API: Passes creators and deliverables in the requested format
    const handleSaveChanges = async () => {
        try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${selectedProject._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: manageStatus,
                    progress: manageProgress,
                    deliverables: selectedProject.deliverables || [],
                    creators: selectedProject.creators || []
                }),
            });

            if (response.ok) {
                // Close the box after save
                setShowManageModal(false);
                // Call Get All API to refresh data
                await fetchProjects();
                
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000);
            }
        } catch (error) {
            console.error("Failed to update project:", error);
        }
    };

    const openProjectDetails = (project) => {
        setSelectedProject(project);
        setShowDetailModal(true);
    };

    const openManageProject = (project) => {
        // This binds the existing data (including creators) to the manage box state
        setSelectedProject({ ...project });
        setManageStatus(project.status);
        setManageProgress(project.progress);
        setShowManageModal(true);
        setSaveSuccess(false);
    };

    // Function to add a creator to the local list before saving to DB
    const handleAddCreatorLocal = () => {
        if (creatorName && creatorEmail) {
            const updatedCreators = [...(selectedProject.creators || []), { name: creatorName, email: creatorEmail }];
            setSelectedProject({ ...selectedProject, creators: updatedCreators });
            setCreatorName('');
            setCreatorEmail('');
        }
    };

    const toggleDeliverable = (item) => {
        const currentDeliverables = selectedProject.deliverables || [];
        let updated;
        if (currentDeliverables.includes(item)) {
            updated = currentDeliverables.filter(d => d !== item);
        } else {
            updated = [...currentDeliverables, item];
        }
        setSelectedProject({ ...selectedProject, deliverables: updated });
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Projects...</div>;

    return (
        <>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
                    Projects
                    <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--s2)', padding: '6px 12px', borderRadius: '8px', marginLeft: '12px' }}>
                        📁 Manage your campaigns
                    </span>
                </h1>
                <p style={{ color: 'var(--muted2)', fontSize: '14px' }}>Track and manage all your creator collaborations</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Total Projects</div>
                    <div style={{ fontSize: '32px', fontWeight: '800' }}>{displayedProjects.length}</div>
                    <div style={{ fontSize: '12px', color: 'var(--green)', marginTop: '4px' }}>Active database entries</div>
                </div>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Active Projects</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--green)' }}>{activeProjects}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Currently Live</div>
                </div>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Total Creators</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--violet)' }}>
                        {displayedProjects.reduce((sum, p) => sum + (p.creators?.length || 0), 0)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Involved in projects</div>
                </div>
                <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Total Budget</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--pink)' }}>${totalBudget.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Allocated funds</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div className="filter-row" style={{ marginBottom: 0 }}>
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="filter-chip"
                            style={{
                                background: filter === f ? 'rgba(139, 92, 246, 0.1)' : 'var(--s2)',
                                borderColor: filter === f ? 'var(--violet)' : 'var(--border)',
                                color: filter === f ? 'var(--violet)' : 'var(--muted2)',
                                cursor: 'pointer'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    style={{ padding: '12px 24px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                >
                    + New Project
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
                {filteredProjects.map(project => (
                    <div key={project._id} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                    📁
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '16px' }}>{project.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Deadline: {project.deadline}</div>
                                </div>
                            </div>
                            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: statusColors[project.status]?.bg || 'var(--s2)', color: statusColors[project.status]?.color || 'var(--text)', fontWeight: '600' }}>
                                {project.status}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Creators</div>
                                <div style={{ fontWeight: '700', fontSize: '14px' }}>{project.creators?.length || 0}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Platforms</div>
                                <div style={{ fontWeight: '600', fontSize: '13px' }}>{project.platforms}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Budget</div>
                                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--violet)' }}>${project.budget}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600' }}>Progress</span>
                                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{project.progress}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--s2)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${project.progress}%`, height: '100%', background: project.progress === 100 ? 'var(--green)' : 'linear-gradient(90deg, var(--violet), var(--pink))', borderRadius: '3px' }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => openProjectDetails(project)} style={{ flex: 1, padding: '10px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                                View Details
                            </button>
                            <button onClick={() => openManageProject(project)} style={{ padding: '10px 16px', background: 'var(--violet)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                                Manage
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Project Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', width: '500px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Create New Project</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Project Name *</label>
                                <input 
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                                    placeholder="Enter project name" 
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Budget *</label>
                                <input 
                                    value={newProject.budget}
                                    onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                                    placeholder="0" 
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Deadline</label>
                                <input 
                                    value={newProject.deadline}
                                    onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                                    type="date" 
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Platforms</label>
                                <input 
                                    value={newProject.platforms}
                                    onChange={(e) => setNewProject({...newProject, platforms: e.target.value})}
                                    placeholder="Instagram, TikTok, YouTube" 
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Description</label>
                                <textarea 
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                    placeholder="Project description" 
                                    rows={3}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', resize: 'none' }} 
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleAddProject} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Create Project</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Details Modal */}
            {showDetailModal && selectedProject && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowDetailModal(false)}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', width: '600px', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                                    📁
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '22px', fontWeight: '700' }}>{selectedProject.name}</h2>
                                    <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: statusColors[selectedProject.status]?.bg || 'var(--s2)', color: statusColors[selectedProject.status]?.color || 'var(--text)', fontWeight: '600' }}>
                                        {selectedProject.status}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>

                        <p style={{ fontSize: '14px', color: 'var(--muted2)', marginBottom: '24px', lineHeight: '1.6' }}>
                            {selectedProject.description || 'No description available for this project.'}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ background: 'var(--s2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--violet)' }}>{selectedProject.creators?.length || 0}</div>
                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Creators</div>
                            </div>
                            <div style={{ background: 'var(--s2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--pink)' }}>${selectedProject.budget}</div>
                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Budget</div>
                            </div>
                            <div style={{ background: 'var(--s2)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--green)' }}>{selectedProject.progress}%</div>
                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Progress</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Platforms</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {selectedProject.platforms?.split(', ').map((p, i) => (
                                    <span key={i} style={{ padding: '6px 12px', background: 'var(--s2)', borderRadius: '8px', fontSize: '12px' }}>{p}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Timeline</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)' }}>
                                <span>Start: {new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                                <span>Deadline: {selectedProject.deadline}</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--s2)', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${selectedProject.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--violet), var(--pink))', borderRadius: '4px' }}></div>
                            </div>
                        </div>

                        <button onClick={() => { setShowDetailModal(false); openManageProject(selectedProject); }} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                            Manage Project →
                        </button>
                    </div>
                </div>
            )}

            {/* Manage Project Modal */}
            {showManageModal && selectedProject && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowManageModal(false)}>
                    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', width: '700px', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '700' }}>Manage: {selectedProject.name}</h2>
                            <button onClick={() => setShowManageModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                            <div style={{ background: 'var(--s2)', padding: '20px', borderRadius: '12px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Project Status</div>
                                <select 
                                    value={manageStatus}
                                    onChange={(e) => setManageStatus(e.target.value)}
                                    style={{ width: '100%', padding: '10px', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                                >
                                    <option value="Planning">Planning</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Live">Live</option>
                                    <option value="Review">Review</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div style={{ background: 'var(--s2)', padding: '20px', borderRadius: '12px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Progress</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input 
                                        type="range" min="0" max="100" 
                                        value={manageProgress}
                                        onChange={(e) => setManageProgress(parseInt(e.target.value))}
                                        style={{ flex: 1, accentColor: 'var(--violet)' }}
                                    />
                                    <span style={{ fontSize: '18px', fontWeight: '800', minWidth: '50px' }}>{manageProgress}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Creators Entry Section */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Add Creator Details</div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                <input 
                                    value={creatorName} 
                                    onChange={(e) => setCreatorName(e.target.value)} 
                                    placeholder="Enter Name"
                                    style={{ flex: 1, padding: '10px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                                />
                                <input 
                                    value={creatorEmail} 
                                    onChange={(e) => setCreatorEmail(e.target.value)} 
                                    placeholder="Enter Email"
                                    style={{ flex: 1, padding: '10px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                                />
                                <button onClick={handleAddCreatorLocal} style={{ padding: '10px 20px', background: 'var(--violet)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                    Add
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {selectedProject.creators?.map((creator, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--s2)', borderRadius: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--s1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>👤</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{creator.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{creator.email}</div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const updated = selectedProject.creators.filter((_, idx) => idx !== i);
                                                setSelectedProject({ ...selectedProject, creators: updated });
                                            }}
                                            style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Deliverables Checkbox Section */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Deliverables</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {availableDeliverables.map((item, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => toggleDeliverable(item)}
                                        style={{ 
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                                            background: selectedProject.deliverables?.includes(item) ? 'rgba(139,92,246,0.1)' : 'var(--s2)', 
                                            border: '1px solid',
                                            borderColor: selectedProject.deliverables?.includes(item) ? 'var(--violet)' : 'var(--border)',
                                            borderRadius: '12px', cursor: 'pointer' 
                                        }}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={selectedProject.deliverables?.includes(item)} 
                                            onChange={() => {}} // div click handles this
                                            style={{ accentColor: 'var(--violet)' }} 
                                        />
                                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowManageModal(false)} style={{ flex: 1, padding: '12px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                            <button 
                                onClick={handleSaveChanges} 
                                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, var(--violet), var(--pink))', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}