import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { logout } from "../redux/authSlice"; // Import Redux logout action

import backArrow from "../assets/arrow_back.svg";
import notificationIcon from "../assets/notification_icon.svg";
import profilePhoto from "../assets/profile_photo.jpeg";
import settingsIcon from "../assets/setting.svg";
import profileIcon from "../assets/profile_icon.svg";
import logoutIcon from "../assets/logout_icon.svg";

const NavbarHorizontal = () => {
  const [notificationCount, setNotificationCount] = useState(10);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.auth.user); // Get user from Redux

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();
    setIsVisible(false);

    try {
      await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );

      toast.success("Logout successful!");
      dispatch(logout()); // Clear Redux user state first
      localStorage.removeItem("token");
      navigate("/auth");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Format route path
  const formattedPath = location.pathname
    .split("/")
    .filter((segment) => segment)
    .map((segment) => segment.replace(/_/g, " ").toUpperCase())
    .join(" > ");

  return (
    <section className="pr-20 sm:px-5 h-fit w-full flex justify-end sm:justify-between items-center">
      {/* Back Button and Path Display */}
      <div className="gap-3 hidden sm:flex sm:justify-center sm:items-center">
        <img src={backArrow} alt="Back" />
        <div>{formattedPath || "HOME"}</div>
      </div>

      {/* User Dropdown or Login Button */}
      {user ? (
        <div ref={dropdownRef} className="relative py-5 w-fit h-fit flex justify-center gap-5">
          {/* Notifications */}
          <div className="relative flex items-center justify-center">
            <img className="h-5 w-5" src={notificationIcon} alt="Notifications" />
            <div className="absolute top-0 right-[-4px] bg-custom-pink h-4 w-4 rounded-full flex items-center justify-center text-xs">
              {notificationCount}
            </div>
          </div>

          <div className="border-[1px]"></div>

          {/* Profile Picture */}
          <div className="h-8 w-8 cursor-pointer" onClick={() => setIsVisible(!isVisible)}>
            <img className="aspect-1/1 h-full w-full rounded-full" src={profilePhoto} alt="Profile" />
          </div>

          {/* Dropdown Menu */}
          {isVisible && (
            <div className="shadow-custom absolute right-5 top-[calc(100%-15px)] mt-2 w-52 bg-custom-bg-2 rounded-2xl h-fit flex flex-col py-6 z-50">
              {/* User Info */}
              <div className="w-full h-fit flex flex-col pl-6 gap-1 pb-8 border-b-2">
                <div className="text-sm font-semibold tracking-wide">
                  {user?.username?.toUpperCase()}
                </div>
                <div className="text-xs">{user?.email}</div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col gap-3 pt-4">
                <Link to="/user" onClick={() => setIsVisible(false)} className="flex justify-start items-center pl-6 gap-2">
                  <img src={profileIcon} alt="Profile" />
                  <div className="text-sm">Profile</div>
                </Link>

                <Link to="/settings" className="flex justify-start items-center pl-6 gap-2">
                  <img src={settingsIcon} alt="Settings" />
                  <div className="text-sm">Settings</div>
                </Link>

                <button onClick={handleSignOut} className="flex justify-start items-center pl-6 gap-2">
                  <img src={logoutIcon} alt="Logout" />
                  <div className="text-sm">Sign Out</div>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link to="/auth" className="py-5 w-fit h-fit">
          <button className="bg-custom-pink px-4 py-2 text-black rounded-lg">
            Login
          </button>
        </Link>
      )}
    </section>
  );
};

export default NavbarHorizontal;
