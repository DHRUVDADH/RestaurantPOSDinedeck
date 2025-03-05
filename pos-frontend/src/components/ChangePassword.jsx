import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state)=>state.auth.user)
  const dispatch = useDispatch()

  const handlePasswordChange = (e) => {
    e.preventDefault();

    const userData = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    axios
      .patch("http://localhost:8000/api/v1/users/change-password", userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored in localStorage or Context API
        },
      })

      .then((response) => {
        // console.log("Password Changed Successfully ", response.data);
        toast.success(
          "Password Updated Successfully"
        );
        dispatch(setUser(null))
        navigate("/auth");
      })
      .catch((error) => {
        console.error(
          "Reset Password failed:",
          error.response?.data?.error || error.message
        );
        toast.error("Reset Password failed. Please try again.");
      });
  };

  return (
    <section className="w-full h-fit flex justify-center items-center pt-14">
      <form
        onSubmit={handlePasswordChange}
        className="w-[400px] h-fit flex flex-col justify-center items-center"
      >
        <div className="w-fit h-fit text-center my-6 text-4xl font-semibold">
          Reset Your Password
        </div>

        <div className="sm:w-[450px] w-[280px] mt-8 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="oldPassword">
            Current Password
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="sm:w-[450px] w-[280px] mt-8 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="newPassword">
            New Password
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="sm:w-[450px] w-[280px] mt-8 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="px-10 py-4 text-sm rounded-md bg-custom-pink text-black mt-10"
        >
          Save Password
        </button>
      </form>
    </section>
  );
};

export default ChangePassword;
