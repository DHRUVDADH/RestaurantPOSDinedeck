import React, { useState } from "react";
import paswordClose from "../assets/password_close.svg";
import paswordOpen from "../assets/password_open.svg";
import axios from "axios";  
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const Auth = ({ fetchUser }) => {
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fixed: Move handleSignUp inside the component
  const handleSignUp = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      email,
      password,
      userRole: userRole.toLowerCase(),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/signup",
        userData
      );
      toast.success("Signup successful! Please log in.");
      setIsSignUp(false);
      
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response?.data?.error || error.message
      );
      toast.error("Signup failed. Please try again.");
    }
  };

  // ✅ Fixed: Move handleSignIn inside the component
  const handleSignIn = async (e) => {
    e.preventDefault();
    const userData = { email, password };
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        userData
      );
      // console.log("Login successful:", response.data);
      toast.success("Login successful!");
  
      // Store token
      localStorage.setItem("token", response.data.message.accessToken);
  
      // console.log("Calling fetchUser after login...");
  
      if (typeof fetchUser === "function") {
        const user = await fetchUser(dispatch);
        if (user) {
          dispatch(setUser(user));
        }
      } else {
        console.error("fetchUser is not a function");
      }
  
      navigate("/menu");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.error || error.message
      );
      toast.error("Login failed. Please try again.");
    }
  };
  

  return (
    <section className="w-screen sm:w-full h-full flex flex-col items-center justify-center">
      <div className="h-fit w-fit text-4xl text-custom-pink mb-12">
        DineDeck
      </div>

      {isSignUp ? (
        <form
          onSubmit={handleSignUp}
          className="h-fit sm:w-fit w-full bg-custom-bg-2 rounded-2xl px-12 py-16 flex flex-col items-center justify-center"
        >
          <div className="text-3xl">SignUp!</div>

          <div className="sm:w-[450px] w-[280px] mt-12 flex flex-col items-start">
            <label className="text-[11px] ml-1" htmlFor="username">
              Username
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

          <div className="sm:w-[450px] w-[280px] mt-12 flex flex-col items-start">
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

          <div className="relative sm:w-[450px] w-[280px] mt-12 flex flex-col items-start">
            <label className="text-[11px] ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative w-full">
              <input
                className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
                type={isEyeOpen ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={isEyeOpen ? paswordClose : paswordOpen}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
                alt=""
                onClick={() => setIsEyeOpen(!isEyeOpen)}
              />
            </div>
          </div>

          <div className="sm:w-[450px] w-[280px] mt-12 flex flex-col items-start">
            <label className="text-[11px] ml-1" htmlFor="userRole">
              User Role
            </label>
            <select
              className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
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

          <div
            className="cursor-pointer text-[13px] w-[280px] sm:w-[450px] flex justify-end underline mt-4"
            onClick={() => setIsSignUp(false)}
          >
            Login?
          </div>

          <button
            type="submit"
            className="px-10 py-4 text-sm rounded-md bg-custom-pink text-black mt-8"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleSignIn}
          className="h-fit sm:w-fit w-full bg-custom-bg-2 rounded-2xl px-12 py-16 flex flex-col items-center justify-center"
        >
          <div className="text-3xl">Login!</div>

          <div className="sm:w-[450px] w-[280px] mt-12 flex flex-col items-start">
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

          <div className="relative sm:w-[450px] w-[280px] mt-7 flex flex-col items-start">
            <label className="text-[11px] ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative w-full"  >
              <input
                className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
                type={isEyeOpen ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={isEyeOpen ? paswordClose : paswordOpen}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
                alt=""
                onClick={() => setIsEyeOpen(!isEyeOpen)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-10 py-4 text-sm rounded-md bg-custom-pink text-black mt-8"
          >
            Login
          </button>
        </form>
      )}
    </section>
  );
};

export default Auth;
