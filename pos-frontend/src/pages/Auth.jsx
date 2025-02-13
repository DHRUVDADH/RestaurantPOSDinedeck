import React from "react";
import paswordClose from '../assets/password_close.svg'
// import paswordOpen from '../assets/password_open.svg'

const Auth = () => {
  return (
    <section className="w-screen h-full flex flex-col items-center justify-center">


      <div className="h-fit w-fit text-4xl text-custom-pink mb-24">DineDeck</div>


      <form className="h-fit w-fit bg-custom-bg-2 rounded-2xl px-12 py-16 flex flex-col items-center justify-center">

        <div className="text-3xl">Login!</div>
        <div className="text-sm mt-6">Please enter your credentials below to continue</div>


        <div className="w-[450px] mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="username">Username</label>
          <input className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1" type="text" id="username" />
        </div>


        <div className="w-[450px] mt-7 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="password">Password</label>
          <div className="relative w-full">
            <input className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1" type="text"  id="password" />
            <img src={paswordClose} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer" alt="" />
            {/* <img src={paswordOpen} alt="" /> */}
          </div>
        </div>

        <div className="w-full h-fit flex justify-between mt-3">
          <div className="flex gap-2">
            <input type="checkbox" className=" text-[12px] appearance-none w-4 h-4 border border-custom-pink rounded-sm checked:bg-custom-pink checked:border-custom-pink focus:ring-0" id="check" />
            <label className="text-[11.5px]" htmlFor="check">Remember Me</label>
          </div>
          <div className="text-[11.5px] underline" >Forgot Password?</div>
        </div>

        <button className="px-10 py-4 text-sm rounded-md bg-custom-pink text-black mt-8">Login</button>

      </form>
    </section>
  );
};

export default Auth;
