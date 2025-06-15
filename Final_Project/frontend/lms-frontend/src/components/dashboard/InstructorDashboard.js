import React, { useState, useEffect } from 'react';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    pendingCourses: 0,
    rejectedCourses: 0,
    totalEnrollments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Decode token to get instructor ID
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      
      const response = await fetch('http://localhost:5000/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const instructorCourses = (data.courses || data || []).filter(
          course => course.instructor_id === userId
        );
        
        setCourses(instructorCourses);
        
        // Calculate stats with parseInt fix
        const calculatedStats = {
          totalCourses: instructorCourses.length,
          publishedCourses: instructorCourses.filter(c => c.is_published && c.is_approved).length,
          pendingCourses: instructorCourses.filter(c => c.status === 'pending' || (!c.status && !c.is_approved)).length,
          rejectedCourses: instructorCourses.filter(c => c.status === 'rejected').length,
          totalEnrollments: instructorCourses.reduce((sum, course) => {
            return sum + (parseInt(course.students_count) || 0);
          }, 0)
        };
        
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error fetching instructor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        alert('Course deleted successfully');
        fetchInstructorData();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Instructor Dashboard</h1>
        <div style={styles.headerActions}>
          <button style={styles.createBtn} onClick={() => window.location.href = '/create-course'}>
            + Create New Course
          </button>
          <button style={styles.logoutBtn} onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div style={styles.statIcon}>📚</div>
          <div style={styles.statValue}>{stats.totalCourses}</div>
          <div style={styles.statLabel}>Total Courses</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statValue}>{stats.totalEnrollments}</div>
          <div style={styles.statLabel}>Total Students</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statValue}>{stats.publishedCourses}</div>
          <div style={styles.statLabel}>Published</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
          <div style={styles.statIcon}>⏳</div>
          <div style={styles.statValue}>{stats.pendingCourses}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
      </div>

      {/* Rejected Courses Alert */}
      {stats.rejectedCourses > 0 && (
        <div style={styles.rejectedAlert}>
          <strong>⚠️ You have {stats.rejectedCourses} rejected course(s)</strong>
          <p>Please review and fix the issues to resubmit for approval.</p>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button 
          style={activeTab === 'courses' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('courses')}
        >
          All Courses
        </button>
        <button 
          style={activeTab === 'published' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('published')}
        >
          Published ({stats.publishedCourses})
        </button>
        <button 
          style={activeTab === 'pending' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({stats.pendingCourses})
        </button>
        <button 
          style={activeTab === 'rejected' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected ({stats.rejectedCourses})
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'rejected' && courses.filter(c => c.status === 'rejected').length > 0 && (
          <div style={styles.rejectedSection}>
            {courses.filter(c => c.status === 'rejected').map(course => (
              <div key={course.id} style={styles.rejectedCard}>
                <h3>{course.title}</h3>
                <div style={styles.rejectionInfo}>
                  <strong>Rejection Reason:</strong>
                  <p>{course.rejection_reason || 'No specific reason provided'}</p>
                </div>
                <div style={styles.rejectedActions}>
                  <button style={styles.editBtn} onClick={() => window.location.href = `/edit-course/${course.id}`}>
                    Edit & Resubmit
                  </button>
                  <button style={styles.deleteBtn} onClick={() => handleDeleteCourse(course.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(activeTab !== 'rejected' || courses.filter(c => c.status === 'rejected').length === 0) && (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Course Title</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Students</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses
                  .filter(course => {
                    if (activeTab === 'published') return course.is_published && course.is_approved;
                    if (activeTab === 'pending') return course.status === 'pending' || (!course.status && !course.is_approved);
                    if (activeTab === 'rejected') return course.status === 'rejected';
                    return true;
                  })
                  .map(course => (
                    <tr key={course.id}>
                      <td style={styles.td}>{course.title}</td>
                      <td style={styles.td}>
                        {course.status === 'rejected' ? (
                          <span style={{...styles.statusBadge, ...styles.rejectedBadge}}>Rejected</span>
                        ) : course.status === 'pending' || (!course.status && !course.is_approved) ? (
                          <span style={{...styles.statusBadge, ...styles.pendingBadge}}>Pending</span>
                        ) : course.is_published ? (
                          <span style={{...styles.statusBadge, ...styles.publishedBadge}}>Published</span>
                        ) : (
                          <span style={{...styles.statusBadge, ...styles.draftBadge}}>Draft</span>
                        )}
                      </td>
                      <td style={styles.td}>{parseInt(course.students_count) || 0}</td>
                      <td style={styles.td}>{new Date(course.created_at).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <button style={styles.actionBtn} onClick={() => window.location.href = `/course/${course.id}`}>
                          View
                        </button>
                        {course.status !== 'rejected' && (
                          <button style={styles.actionBtn} onClick={() => window.location.href = `/edit-course/${course.id}`}>
                            Edit
                          </button>
                        )}
                        <button style={{...styles.actionBtn, ...styles.deleteActionBtn}} onClick={() => handleDeleteCourse(course.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {courses.filter(course => {
              if (activeTab === 'published') return course.is_published && course.is_approved;
              if (activeTab === 'pending') return course.status === 'pending' || (!course.status && !course.is_approved);
              if (activeTab === 'rejected') return course.status === 'rejected';
              return true;
            }).length === 0 && (
              <p style={styles.noData}>No courses found in this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


  const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333'
  },
  headerActions: {
    display: 'flex',
    gap: '10px'
  },
  createBtn: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  statsGrid: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    flex: '1 1 200px',
    textAlign: 'center'
  },
  statIcon: {
    fontSize: '30px',
    marginBottom: '10px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: '14px',
    color: '#555'
  },
  rejectedAlert: {
    backgroundColor: '#fff3f3',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    padding: '15px',
    color: '#a94442',
    marginBottom: '20px'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
  },
  tab: {
    padding: '8px 16px',
    backgroundColor: '#eee',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#555'
  },
  activeTab: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd'
  },
  rejectedSection: {
    display: 'grid',
    gap: '15px'
  },
  rejectedCard: {
    backgroundColor: '#fff',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    padding: '15px'
  },
  rejectionInfo: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fefefe',
    borderLeft: '4px solid #dc3545',
    borderRadius: '4px'
  },
  rejectedActions: {
    marginTop: '10px',
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f1f1f1'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd'
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  publishedBadge: {
    backgroundColor: '#d4edda',
    color: '#155724'
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
    color: '#856404'
  },
  rejectedBadge: {
    backgroundColor: '#f8d7da',
    color: '#721c24'
  },
  draftBadge: {
    backgroundColor: '#e2e3e5',
    color: '#383d41'
  },
  actionBtn: {
    padding: '6px 10px',
    marginRight: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  deleteActionBtn: {
    backgroundColor: '#dc3545'
  },
  noData: {
    textAlign: 'center',
    padding: '30px',
    color: '#777'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};


// Add CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default InstructorDashboard;