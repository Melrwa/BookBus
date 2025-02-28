// checkSession function
export const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/check-session", {
        method: "GET",
        credentials: "include", // Include cookies for session-based auth
      });
  
      if (!response.ok) {
        throw new Error("Session check failed");
      }
  
      const data = await response.json();
      return data; // { role: "admin" | "driver" | "user", user: { ... } }
    } catch (error) {
      console.error("Error checking session:", error);
      return null;
    }
  };


// refreshToken function
export const refreshToken = async () => {
  try {
    const response = await fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include", // Include cookies for session-based auth
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    return data.token; // New access token
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};