import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Assuming you use Redux for user state

const AdminRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user); // Get user from Redux store

  console.log("Checking user role:", user); // ✅ Debug log
  if (!user || user.userRole !== "admin") {
    return <Navigate to="/" replace />; // Redirect non-admins to home
  }

  return element;
};

export default AdminRoute;
