// checkSession function
export const checkSession = async () => {
  try {
    const response = await fetch('/api/check_session', {
      method: 'GET',
      credentials: 'include', // Include cookies for session-based auth
    });

    if (!response.ok) {
      throw new Error('Session check failed');
    }

    const data = await response.json();
    localStorage.setItem('role', data.role); // Store role in localStorage
    localStorage.setItem('token', data.token); // Store token in localStorage
    return data; // { role: "admin" | "driver" | "customer", token: "..." }
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
};



// logout function
export const logout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'DELETE',
      credentials: 'include', // Include cookies for session-based auth
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Clear client-side state
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};