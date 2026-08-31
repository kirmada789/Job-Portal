function PublicOnlyRoute({ children }) {
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  if (currentUser) {
    // Agar user logged-in hai, toh role ke hisaab se sahi dashboard par bhej do
    const role = currentUser.role?.trim().toLowerCase();
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'recruiter') return <Navigate to="/recruiter" replace />;
    return <Navigate to="/seeker" replace />;
  }

  return children;
}