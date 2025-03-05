import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth, Home, Menu, Order, Profile } from "./pages";
import {
  ChangePassword,
  Navbar,
  NavbarHorizontal,
} from "./components";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/authSlice";

const fetchUser = async (dispatch) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found. User is not logged in.");
    dispatch(setUser(null));
    return null; // ✅ Return null explicitly
  }

  try {
    const response = await axios.get(
      "http://localhost:8000/api/v1/users/get-current-user",
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    // console.log("User fetched:", response.data);
    dispatch(setUser(response.data.message));
    return response.data.message; // ✅ Explicitly return user data
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response?.data || error.message
    );
    dispatch(setUser(null));
    return null; // ✅ Return null explicitly
  }
};

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUser(dispatch);
    }
  }, []);

  return (
    <Router>
      <div className="bg-custom-bg text-white min-h-screen flex flex-row  overflow-x-hidden">
        <Navbar />
        <div className="sm:w-[calc(100%-160px)] w-full flex flex-col">
          {" "}
          {/* sm:w-[calc(100%-160px)] */}
          <NavbarHorizontal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth fetchUser={fetchUser} />} />
            <Route path="/menu" element={<Menu />} />
            <Route
              path="/user"
              element={<Profile fetchUser={fetchUser} />}
            ></Route>
            <Route path="/changePassword" element={<ChangePassword />}></Route>
            <Route path="/order" element={<Order/>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
