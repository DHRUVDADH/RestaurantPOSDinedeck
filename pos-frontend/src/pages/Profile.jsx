import React, { useState, useEffect } from "react";
import profileImage from "../assets/profile_photo.jpeg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector , useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const Profile = ({fetchUser}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleSubmitChanges = (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      userRole,
    };

    axios
      .patch("http://localhost:8000/api/v1/users/update-profile", userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("User profile updated successfully", response.data.message);
        toast.success("User profile updated successfully");
        dispatch(setUser(response.data.message))

        // Reload the page to fetch updated user data
        window.location.reload();
      })
      .catch((error) => {
        console.error(
          "User Profile update failed:",
          error.response?.data?.error || error.message
        );
        toast.error("User Profile update failed. Please try again.");
      });
  };

  return (
    <section className="w-full h-fit flex justify-center items-center pt-14">
      <form
        onSubmit={handleSubmitChanges}
        className="w-[400px] h-fit flex flex-col justify-center items-center"
      >
        <div className="flex flex-col justify-center items-center gap-3">
          <img className="h-24 w-24 rounded-full" src={profileImage} alt="" />
          <div className="text-sm font-extralight">Change Profile Picture</div>
        </div>
        <div className="w-fit h-fit text-center my-6 text-2xl font-semibold">
          {user?.username?.toUpperCase() || "Guest"}
        </div>

        <div className="sm:w-[450px] w-[280px] mt-8 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="username">
            Name
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="sm:w-[450px] w-[280px] mt-8 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="email">
            Email
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="sm:w-[450px] w-[280px] mt-8 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="userRole">
            User Role
          </label>
          <select
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1 pr-6"
            id="userRole"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-10 py-4 text-sm rounded-md bg-custom-pink text-black mt-10"
        >
          Save Changes
        </button>
      </form>
    </section>
  );
};

export default Profile;
