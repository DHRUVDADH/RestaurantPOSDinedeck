import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import navbarIcon from "../assets/navbar_icon.svg";
import hamburger_open from "../assets/navbar_hamburger.svg";
import arrow_close from "../assets/close_arrow.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // it returns the selected item from the menu by comparing the paths i.e /auth or /description etc...
  const location = useLocation();

  

  return (
    <div className={`${isOpen ? `sm:w-40 w-screen` : `sm:w-40 w-0`}`}>
      <button
        className="fixed top-6 right-4 z-50 block sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <img src={arrow_close}></img>
        ) : (
          <img src={hamburger_open}></img>
        )}
      </button>
      <section
        className={`sm:h-full sm:w-40 fixed left-0 top-0 w-40 rounded-r-[15px] bg-custom-bg sm:bg-custom-bg-2  flex flex-col justify-start items-center gap-5 ${
          isOpen
            ? `h-screen z-20 w-screen flex justify-start items-center `
            : `w-40 z-20`
        }`}
      >
        <div className="mt-5 text-[20px] text-custom-pink tracking-wider font-semibold">
          DINDECK
        </div>
        <div
          className={`h-fit w-fit flex ${
            isOpen ? `flex flex-col` : `hidden sm:flex sm:flex-col`
          } items-center`}
        >
          {[
            { name: "Dashboard", path: "/auth" },
            { name: "Menu", path: "/menu" },
            { name: "Staff", path: "/asd" },
            { name: "Inventory", path: "/dasdesc" },
            { name: "Reports", path: "/sdad" },
            { name: "Order/Table", path: "/order" },
            { name: "Reservation", path: "/desdsc" },
          ].map((item, index) => (
            <>
              <Link
                key={index}
                className={`h-fit w-24 flex flex-col items-center py-2 px-2 gap-2 rounded-[5px] ${
                  location.pathname === item.path ? `bg-custom-pink` : ``
                }`}
                to={item.path}
              >
                <div className="w-fit h-fit p-1.5 rounded-full bg-white">
                  <img src={navbarIcon} />
                </div>
                <div className="text-xs">{item.name}</div>
              </Link>
              <hr className={`mt-3 mb-2 w-[75px] border-custom-input-bg `} />
            </>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Navbar;
