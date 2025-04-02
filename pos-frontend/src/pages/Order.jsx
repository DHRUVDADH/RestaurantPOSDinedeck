import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../redux/authSlice";

import allIcon from "../assets/menu_all.svg"
import allIconBlack from "../assets/menu_all_black.svg"

const Order = () => {
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Parse JSON

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isSelected, setIsSelected] = useState("all");
  const [itemCounts, setItemCounts] = useState({});
  let totalCost = 0;

  const menuItemMap = new Map(menuItems.map((item) => [item._id, item]));

  const updatedItemsCount = Object.entries(itemCounts).reduce(
    (acc, [itemId, count]) => {
      if (count > 0) {
        const item = menuItemMap.get(itemId);
        acc.push({
          menuId: itemId,
          quantity: count,
          price: item ? item.itemPrice : 0, // Avoids unnecessary find()
        });
      }
      return acc;
    },
    []
  );

  const fetchData = async () => {
    // console.log("UP", updatedItemsCount); // Debugging to verify the structure

    const totalCost = Object.entries(itemCounts).reduce(
      (acc, [itemId, count]) => {
        const item = menuItemMap.get(itemId);
        return acc + (item ? item.itemPrice * count : 0);
      },
      0
    );

    const orderPayload = {
      items: updatedItemsCount,
      totalPrice: totalCost,
      table: 1,
    };

    console.log("Sending Order Payload:", orderPayload);
    try {
      const token = localStorage.getItem("token");

      const categoriesRes = await axios.get(
        "http://localhost:8000/api/v1/categories?limit=50",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let fetchedCategories = categoriesRes.data.message.docs || [];
      fetchedCategories = [
        { _id: "all", name: "All", image1: allIcon, image2: allIconBlack },
        ...fetchedCategories,
      ];

      setCategories(fetchedCategories);

      const menuItemsRes = await axios.get(
        "http://localhost:8000/api/v1/menu?limit=50",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedMenuItems = menuItemsRes.data.message.docs || [];
      setMenuItems(fetchedMenuItems);
    } catch (error) {}
  };

  const createOrder = async () => {
    try {
      if (!user || !user._id) {
        console.error("User not found. Please log in.");
        return;
      }

      // Calculate total cost
      const totalCost = Object.entries(itemCounts).reduce(
        (acc, [itemId, count]) => {
          const item = menuItemMap.get(itemId);
          return acc + (item ? item.itemPrice * count : 0);
        },
        0
      );

      // Prepare order payload
      const orderPayload = {
        items: updatedItemsCount, // Processed item data
        totalPrice: totalCost, // Computed total cost
        table: 1, // Hardcoded for now, update as needed
      };

      console.log("Sending Order Payload:", orderPayload);

      const token = localStorage.getItem("token");

      // API call to create order
      const response = await axios.post(
        `http://localhost:8000/api/v1/order/${user._id}`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order Created Successfully:", response.data);
      toast.success("Order Created Successfully!");
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data || error.message
      );
      toast.error("Failed to place order.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Updated Items Count:", updatedItemsCount);
  }, [itemCounts, menuItems]);

  const handleCountChange = (itemId, change) => {
    setItemCounts((prev) => {
      const newCount = Math.max((prev[itemId] || 0) + change, 0);
      return {
        ...prev,
        [itemId]: newCount,
      };
    });
  };

  // const filteredMenuItems = menuItems.filter((item) => {
  //   const isStatusMatch =
  //     isSelected.toLowerCase() === "all" ||
  //     item.orderStatus === isSelectedMenu;
  //   // (menuItem) => menuItem.itemCategory.toString() === isSelected?.toString()
  // });

  const filteredMenuItems = menuItems.filter((item) => {
    return isSelected === "all" || item.itemCategory.toString() === isSelected.toString();
  }); 
  
  return (
    <section className="h-fit w-full flex gap-10 mt-5 pl-8 ">
      <div className="w-fit h-fit flex flex-col justify-center items-center gap-6">
        <div className="w-fit min-h-[350px] h-fit grid grid-cols-5 gap-3  ">
          {categories.map((item, key) => {
            if (isSelected == item._id) {
              return (
                <div
                  className="cursor-pointer p-3 rounded-lg h-32 w-32 sm:h-40 sm:w-40 flex flex-col justify-between bg-custom-pink"
                  onClick={() => {
                    setIsSelected(item._id);
                  }}
                  key={item._id}
                >
                  <div className="w-full h-fit flex justify-end">
                    <img
                      className="h-fit aspect-1/1"
                      src={item.image2}
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="text-black">{item.name}</div>
                    <div className=" text-black font-extralight text-sm mt-1">
                      {item._id === "all"
                        ? menuItems.length
                        : menuItems.filter(
                            (menuItem) => menuItem.itemCategory === item._id
                          ).length}{" "}
                      items
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  className="cursor-pointer  p-3 rounded-lg h-32 w-32 sm:h-40 sm:w-40  flex flex-col justify-between bg-custom-bg-2"
                  onClick={() => {
                    setIsSelected(item._id);
                  }}
                  key={item._id}
                >
                  <div className="w-full h-fit flex justify-end">
                    <img
                      className="h-fit aspect-1/1"
                      src={item.image1}
                      alt=""
                    />
                  </div>
                  <div>
                    <div>{item.name}</div>
                    <div className="font-extralight text-sm mt-1">
                      {item._id === "all"
                        ? menuItems.length
                        : menuItems.filter(
                            (menuItem) => menuItem.itemCategory === item._id
                          ).length}{" "}
                      items
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="h-[2px] w-full   bg-custom-bg-2 border-custom-bg-2"></div>
        <div className="w-fit min-h-[350px] h-fit grid grid-cols-5 gap-3">
          {filteredMenuItems.map((item, key) => (
            <div
              className="cursor-pointer p-5 rounded-lg h-32 w-32 sm:h-40 sm:w-40  flex flex-col justify-start items-start bg-custom-bg-2"
              key={item._id}
            >
              <div className="text-sm text-custom-text-color mb-2">
                Order &#8594; Kitchen
              </div>
              <div className="w-full mb-4">
                <div className="">{item.itemName}</div>
                <div className="text-sm mt-1 text-custom-text-color">
                  &#8377;{item.itemPrice}
                </div>
              </div>
              <div className="w-full flex justify-end items-center gap-2">
                <button
                  className="h-6 w-6 text-center rounded-full bg-custom-input-bg"
                  onClick={() => handleCountChange(item._id, -1)}
                >
                  &#8722;
                </button>
                <div className="h-6 w-fit text-center">
                  {itemCounts[item._id] || 0}
                </div>
                <button
                  className="h-6 w-6 text-center rounded-full bg-custom-pink text-black"
                  onClick={() => handleCountChange(item._id, 1)}
                >
                  &#43;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form className=" max-h-[600px] flex flex-col justify-between items-center">
        <div className=" flex h-[260px] flex-col gap-3">
          <div className="min-w-[400px] flex flex-col">
            <div className="text-2xl font-light tracking-wide">Table 1</div>
            <div className="font-light tracking-wide">
              {user.username.toUpperCase()}
            </div>
          </div>
          {Object.entries(itemCounts).map(([itemId, count], index) => (
            <div
              key={index}
              className={`flex items-center justify-between w-[400px] bg-custom-bg-2 py-3 px-6 rounded-lg ${
                count ? "flex" : "hidden"
              }`}
            >
              <div className="flex items-center">
                <div className="font-light p-1 h-8 w-8 text-center text-black rounded-full bg-custom-pink mr-4">
                  {index + 1}
                </div>
                <div className="flex gap-2 h-fit">
                  <div className="tracking-wide">
                    {menuItems.find((item) => item._id === itemId).itemName}
                  </div>
                  <div className="text-custom-text-color">&#215; {count}</div>
                </div>
              </div>
              <div className="h-fit font-light text-sm">
                &#8377;
                {menuItems.find((item) => item._id === itemId).itemPrice}.00
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-fit flex flex-col items-center gap-3 min-w-[400px] bg-custom-bg-2 py-6 rounded-lg px-4">
          <div className="w-full h-fit flex justify-between px-2">
            <div className="font-light text-sm">Subtotal</div>
            <div className="font-light text-sm">
              {Object.entries(itemCounts).map(([itemId, count], index) => {
                const item = menuItems.find((item) => item._id === itemId);
                const itemCost = item ? item.itemPrice * count : 0;
                totalCost += itemCost; // Accumulate total cost directly

                return <></>;
              })}
              &#8377;{totalCost}.00
            </div>
          </div>
          <div className="w-full h-fit flex justify-between px-2">
            <div className="font-light text-sm">Tax 5%</div>
            <div className="font-light text-sm">
              &#8377;{Math.floor(totalCost * 0.05)}.00
            </div>
          </div>
          <div className="bg-custom-text-color h-[1px] w-full"></div>
          <div className="w-full h-fit flex justify-between px-2">
            <div className="font-light text-sm">Total</div>
            <div className="font-light text-sm">
              &#8377;{Math.floor(totalCost * 0.05) + totalCost}.00
            </div>
          </div>
          <button
            type="button"
            onClick={createOrder}
            className="h-fit w-fit px-8 py-3 bg-custom-pink rounded-md text-black mt-6"
          >
            Send to Kitchen
          </button>
        </div>
      </form>
    </section>
  );
};

export default Order;
