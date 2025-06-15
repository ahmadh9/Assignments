import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      // Load Users - matches backend: router.get('/', ...) in userRoutes.js
      const usersRes = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Load Courses - matches backend: export const getAllCourses in courseController.js
      const coursesRes = await fetch('http://localhost:5000/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  // Delete User - matches backend: router.delete('/:id', ...) in userRoutes.js
  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        alert('User deleted');
        setUsers(users.filter(u => u.id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Delete Course - matches backend: export const deleteCourse in courseController.js
  const deleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        alert('Course deleted');
        setCourses(courses.filter(c => c.id !== courseId));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Approve Course - matches backend: export const approveCourse in courseController.js
  const approveCourse = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        alert('Course approved');
        loadData();
      } else {
        alert('Failed to approve');
      }
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  // Reject Course - using updateCourse with status change
  const rejectCourse = async (courseId) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'rejected',
          is_approved: false,
          rejection_reason: reason
        })
      });
      
      if (res.ok) {
        alert('Course rejected');
        loadData();
      } else {
        alert('Failed to reject');
      }
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading admin dashboard...</p>
      </div>
    );
  }

  const pendingCourses = courses.filter(c => !c.is_approved && c.status !== 'rejected');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage courses and users</p>
        </div>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div style={styles.statIcon}>👥</div>
          <h3 style={styles.statNumber}>{users.length}</h3>
          <p style={styles.statLabel}>Total Users</p>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <div style={styles.statIcon}>📚</div>
          <h3 style={styles.statNumber}>{courses.length}</h3>
          <p style={styles.statLabel}>Total Courses</p>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
          <div style={styles.statIcon}>⏳</div>
          <h3 style={styles.statNumber}>{pendingCourses.length}</h3>
          <p style={styles.statLabel}>Pending Approval</p>
        </div>
      </div>

      {pendingCourses.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⏳ Pending Courses</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Instructor</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCourses.map(course => (
                  <tr key={course.id} style={styles.tr}>
                    <td style={styles.td}>{course.id}</td>
                    <td style={styles.td}>{course.title}</td>
                    <td style={styles.td}>{course.instructor_name}</td>
                    <td style={styles.td}>
                      <button onClick={() => approveCourse(course.id)} style={styles.approveBtn}>
                        ✅ Approve
                      </button>
                      <button onClick={() => rejectCourse(course.id)} style={styles.rejectBtn}>
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📚 All Courses</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id} style={styles.tr}>
                  <td style={styles.td}>{course.id}</td>
                  <td style={styles.td}>{course.title}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      ...(course.status === 'approved' || course.is_approved ? styles.approvedBadge :
                          course.status === 'rejected' ? styles.rejectedBadge :
                          styles.pendingBadge)
                    }}>
                      {course.status || (course.is_approved ? 'approved' : 'pending')}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => deleteCourse(course.id)} style={styles.deleteBtn}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>👥 Users</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{user.id}</td>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.roleBadge,
                      ...(user.role === 'admin' ? styles.adminRole :
                          user.role === 'instructor' ? styles.instructorRole :
                          styles.studentRole)
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {user.role !== 'admin' && (
                      <button onClick={() => deleteUser(user.id)} style={styles.deleteBtn}>
                        🗑️ Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '5px solid #e9ecef',
    borderTop: '5px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#6c757d'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.08)'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#2d3748',
    margin: 0
  },
  subtitle: {
    color: '#718096',
    marginTop: '5px',
    fontSize: '16px'
  },
  logoutBtn: {
    padding: '12px 30px',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(229, 62, 62, 0.3)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginBottom: '40px'
  },
  statCard: {
    padding: '30px',
    borderRadius: '15px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
  },
  statIcon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  statNumber: {
    fontSize: '42px',
    fontWeight: '700',
    margin: '10px 0'
  },
  statLabel: {
    fontSize: '18px',
    opacity: 0.9,
    margin: 0
  },
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    marginBottom: '30px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '25px',
    borderBottom: '2px solid #e9ecef',
    paddingBottom: '15px'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0
  },
  th: {
    textAlign: 'left',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#495057',
    borderBottom: '2px solid #dee2e6',
    fontSize: '15px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tr: {
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #e9ecef',
    color: '#495057',
    fontSize: '15px'
  },
  approveBtn: {
    padding: '8px 20px',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '10px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  rejectBtn: {
    padding: '8px 20px',
    backgroundColor: '#f56565',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  deleteBtn: {
    padding: '8px 20px',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  statusBadge: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'inline-block'
  },
  approvedBadge: {
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
  roleBadge: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'inline-block'
  },
  adminRole: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460'
  },
  instructorRole: {
    backgroundColor: '#e2e3e5',
    color: '#383d41'
  },
  studentRole: {
    backgroundColor: '#d6d8db',
    color: '#494d50'
  }
};

// Add CSS animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  tr:hover {
    background-color: #f8f9fa;
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;