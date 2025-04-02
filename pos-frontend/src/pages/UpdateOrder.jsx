import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import deletePinkIcon from "../assets/delete_pink_icon.svg";
import editPinkIcon from "../assets/edit_pink_icon.svg";
import searchIcon from "../assets/search_icon.svg";
import tickIcon from "../assets/tick_icon.svg";

const UpdateOrder = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSelected, setIsSelected] = useState("");
  const [isSelectedMenu, setIsSelectedMenu] = useState("all");
  const [editingOrderId, setEditingOrderId] = useState(null); // Track editing order
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditClick = (orderId) => {
    setEditingOrderId(orderId); // Set the order being edited
  };

  const handleSaveClick = (orderId, newStatus) => {
    // updatedOrderStatus(orderId, newStatus);
    setEditingOrderId(null); // Exit edit mode after updating
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const page = 1;
      const limit = 50;
      const sortBy = "table";
      const sortType = -1;
      const query = ""; // Add search text if needed

      const orderRes = await axios.get(
        `http://localhost:8000/api/v1/order?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}&query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedOrders = orderRes.data.message.docs || [];
      console.log(fetchedOrders);
      setOrders(fetchedOrders || []);

      const menuItemsRes = await axios.get(
        "http://localhost:8000/api/v1/menu?limit=50",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedMenuItems = menuItemsRes.data.message.docs || [];
      setMenuItems(fetchedMenuItems);

      const userRes = await axios.get(
        `http://localhost:8000/api/v1/users/getUsers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedUsers = userRes.data.message || [];
      console.log("Fetched Users",fetchedUsers)
      setUsers(fetchedUsers);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching data");
    }
  };

  const updatedOrderStatus = async (orderId, orderStatus) => {
    try {
      const updatedOrderRes = await axios.patch(
        `http://localhost:8000/api/v1/order/update-status/${orderId}`,
        {
          orderStatus: orderStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedOrders = updatedOrderRes.data.message || [];
      console.log("Updated status", fetchedOrders);
      toast.success("Order status updated successfully");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus } : order
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Error updating the orderStatus");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const deleteOrderRes = await axios.delete(
        `http://localhost:8000/api/v1/order/delete-order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order Deleted Successfully");
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error(error);
      toast.error("Error deleting the order.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOrders = orders.filter((item) => {
    const isStatusMatch =
      isSelectedMenu.toLowerCase() === "all" ||
      item.orderStatus === isSelectedMenu;
    const lowerSearchQuery = searchQuery.trim().toLowerCase();

    const isSearchMatch =
      lowerSearchQuery === "" ||
      item.items.some((menuItem) =>
        menuItem.menuId.toLowerCase().includes(lowerSearchQuery)
      ) ||
      user.username.toLowerCase().includes(lowerSearchQuery) ||
      item._id.includes(lowerSearchQuery);

    return isStatusMatch && isSearchMatch;
  });

  const getStatusClass1 = (status) => {
    switch (status) {
      case "Pending":
        return "bg-custom-orderStatus-bg-pending"; // Example: Yellow color for pending
      case "Ready":
        return "bg-custom-orderStatus-bg-ready"; // Example: Blue color for ready
      case "Completed":
        return "bg-custom-orderStatus-bg-completed"; // Example: Green color for completed
      case "Cancelled":
        return "bg-custom-orderStatus-bg-cancelled"; // Example: Red color for cancelled
    }
  };

  const getStatusClass2 = (status) => {
    switch (status) {
      case "Pending":
        return "In the Kitchen"; // Example: Yellow color for pending
      case "Ready":
        return "Ready to serve"; // Example: Blue color for ready
      case "Completed":
        return "Done"; // Example: Green color for completed
      case "Cancelled":
        return "Cancelled"; // Example: Red color for cancelled
    }
  };

  const formatDate = (dateString) => {
    const dateOptions = { weekday: "long", day: "2-digit", year: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

    const datePart = new Date(dateString)
      .toLocaleDateString("en-US", dateOptions)
      .replace(",", "");
    const timePart = new Date(dateString).toLocaleTimeString(
      "en-US",
      timeOptions
    );

    return { datePart, timePart };
  };

  return (
    <section className=" flex flex-col items-center gap-8">
      <div className="w-full px-10 flex justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setIsSelectedMenu("all")}
            className={`rounded-md font-light text-sm px-5 py-3  ${
              isSelectedMenu === "all" ? `bg-custom-pink text-black` : ``
            }`}
          >
            All
          </button>
          <button
            onClick={() => setIsSelectedMenu("Pending")}
            className={`rounded-md font-light text-sm px-5 py-3  ${
              isSelectedMenu === "Pending" ? `bg-custom-pink text-black` : ``
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setIsSelectedMenu("Ready")}
            className={`rounded-md font-light text-sm px-5 py-3  ${
              isSelectedMenu === "Ready" ? `bg-custom-pink text-black` : ``
            }`}
          >
            Ready
          </button>
          <button
            onClick={() => setIsSelectedMenu("Completed")}
            className={`rounded-md font-light text-sm px-5 py-3  ${
              isSelectedMenu === "Completed" ? `bg-custom-pink text-black` : ``
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setIsSelectedMenu("Cancelled")}
            className={`rounded-md font-light text-sm px-5 py-3  ${
              isSelectedMenu === "Cancelled" ? `bg-custom-pink text-black` : ``
            }`}
          >
            Cancelled
          </button>
        </div>
        <div className="flex gap-4">
          <Link
            className="bg-custom-pink flex justify-center items-center text-black rounded-md font-light text-sm px-5 py-3"
            to="/order"
          >
            Add New Order
          </Link>
          <div className="relative rounded-md overflow-hidden">
            <input
              className="bg-custom-bg-2 p-3 w-[300px]"
              type="text"
              placeholder="Search a name,order,..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img
              className="absolute top-0 right-0 h-full w-fit p-4"
              src={searchIcon}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="w-fit px-4 grid grid-cols-4 gap-2">
        {filteredOrders.map((item, index) => {
          const { datePart, timePart } = formatDate(item.createdAt);
          return (
            <div
              className="h-fit w-full flex flex-col max-w-[400px] gap-4 bg-custom-bg-2 px-3 rounded-lg py-4"
              key={index}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-14 w-14 bg-custom-pink text-black rounded-md flex items-center justify-center">
                      0{index + 1}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm">
                        {users.find((u)=> u._id === item.owner)?.username.toUpperCase()}
                      </div>
                      <div className="text-xs">
                        Order # {parseInt(item._id.slice(-5), 16)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-[110px] justify-center items-end gap-[2px]">
                    {item?.orderStatus && (
                      <div
                        className={`flex gap-1 rounded-[4px] text-black text-xs px-2 py-1 ${getStatusClass1(
                          item.orderStatus
                        )}`}
                      >
                        <img src={tickIcon} alt="tick" /> {item.orderStatus}
                      </div>
                    )}
                    {editingOrderId === item._id ? (
                      // Show select dropdown when editing
                      <select
                        value={item.orderStatus}
                        onChange={(e) => {
                          updatedOrderStatus(item._id, e.target.value);
                          setEditingOrderId(null);
                        }}
                        className="border-none text-white bg-transparent text-xs rounded px-2 py-1"
                      >
                        <option className="text-black bg-white" value="Pending">
                          Pending
                        </option>
                        <option className="text-black bg-white" value="Ready">
                          Ready
                        </option>
                        <option
                          className="text-black bg-white"
                          value="Completed"
                        >
                          Completed
                        </option>
                        <option
                          className="text-black bg-white"
                          value="Cancelled"
                        >
                          Cancelled
                        </option>
                      </select>
                    ) : (
                      // Show order status as text when not editing
                      <div className="h-5 flex items-center justify-center text-xs">
                        <span
                          className={`${getStatusClass1(
                            item.orderStatus
                          )} h-2 w-2 mr-1 rounded-full`}
                        ></span>
                        {getStatusClass2(item.orderStatus)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full flex justify-between">
                  <div className="text-xs font-extralight">{datePart}</div>
                  <div className="text-xs font-extralight">{timePart}</div>
                </div>
              </div>
              <div className="h-[0.5px] w-full bg-custom-border-color"></div>
              <div className="flex flex-col gap-2">
                <div className="flex">
                  <div className="w-[20px] text-custom-text-color font-light text-sm mr-5">
                    Qty
                  </div>
                  <div className="text-custom-text-color font-light text-sm mr-5 min-w-[180px]">
                    Items
                  </div>
                  <div className="text-custom-text-color font-light text-sm">
                    Price
                  </div>
                </div>
                <div className="flex flex-col min-h-[104px] gap-2">
                  {item.items.map((current, index) => (
                    <div className="flex">
                      <div className="w-[20px] text-sm font-light mr-5">
                        0{current.quantity}
                      </div>
                      <div className="text-sm w-[180px] font-light mr-5">
                        {
                          menuItems
                            .filter((item) => item._id === current.menuId) // Correct filter function
                            .map((item) => item.itemName) // Extract itemName
                        }
                      </div>

                      <div className="text-sm font-light mr-5">
                        &#8377;{current.price}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-[0.5px] w-full bg-custom-border-color mt-2"></div>
                <div className="flex justify-between ">
                  <div className="w-fit text-sm font-light">SubTotal</div>
                  <div className="w-[40px] mr-[12px] text-sm font-light ">
                    &#8377;
                    {item.items.reduce(
                      (total, current) =>
                        total + current.quantity * current.price,
                      0
                    )}
                  </div>
                </div>
                <div className="h-[0.5px] w-full bg-custom-border-color"></div>
              </div>
              <div className="flex gap-3 items-center justify-center">
                <button
                  onClick={() => handleEditClick(item._id)}
                  className="border-[1px] rounded-lg border-custom-pink p-3"
                >
                  <img src={editPinkIcon} alt="" />
                </button>
                <button
                  onClick={() => deleteOrder(item._id)}
                  className="border-[1px] rounded-lg border-solid border-custom-pink p-3"
                >
                  <img src={deletePinkIcon} alt="" />
                </button>
                <button className="py-3 px-10 rounded-md bg-custom-pink text-black h-full">
                  Pay Bill
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UpdateOrder;
