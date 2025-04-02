import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ItemModal, CategoryModal } from "../components/index.js";
import menu_all from "../assets/menu_all.svg";
import menu_pizza from "../assets/menu_pizza.svg";
import menu_burger from "../assets/menu_burger.svg";
import menu_bakery from "../assets/menu_bakery.svg";
import menu_beverage from "../assets/menu_beverage.svg";
import menu_all_black from "../assets/menu_all_black.svg";
import menu_pizza_black from "../assets/menu_pizza_black.svg";
import menu_burger_black from "../assets/menu_burger_black.svg";
import menu_bakery_black from "../assets/menu_bakery_black.svg";
import menu_beverage_black from "../assets/menu_beverage_black.svg";
import pizza123 from "../assets/pizza.jpeg";
import editIcon from "../assets/edit_icon.svg";
import deleteIcon from "../assets/delete_icon.svg";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isSelected, setIsSelected] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const [isSelectedMenu, setIsSelectedMenu] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const categoriesRes = await axios.get(
        "http://localhost:8000/api/v1/categories?limit=50",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedCategories = categoriesRes.data.message.docs || [];
      console.log(fetchedCategories);
      setCategories(fetchedCategories);

      const menuItemsRes = await axios.get(
        "http://localhost:8000/api/v1/menu?limit=50",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedMenuItems = menuItemsRes.data.message.docs || [];
      setMenuItems(fetchedMenuItems);

      // Initialize checkedItems based on fetched menu items
      const initialCheckedState = {};
      fetchedMenuItems.forEach((item) => {
        initialCheckedState[item._id] = false; // All checkboxes start as unchecked
      });

      setCheckedItems(initialCheckedState);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = (id) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the specific item's state
    }));
  };

  const handleToggleAll = (e) => {
    const isChecked = e.target.checked;
    const newState = {};

    menuItems.forEach((item) => {
      newState[item._id] = isChecked; // Use `_id` instead of `id`
    });

    setCheckedItems(newState);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (isSelectedMenu === "specialDeals")
      return item.dealType === "Special Deals";
    if (isSelectedMenu === "newYearDeals")
      return item.dealType === "New Year Deals";
    return isSelected
      ? item.itemCategory.toString() === isSelected.toString()
      : true;
  });

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem("token");

      const deleteRes = await axios.delete(
        `http://localhost:8000/api/v1/menu/delete-item/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

        
      setMenuItems((prevMenuItems) =>
        prevMenuItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      toast.error("Error deleting Item");
      console.error("Error deleting item:", error);
    }
  };

  return (
    <section className="h-fit w-full flex flex-col gap-10 mt-5">
      <div
        className={`h-fit w-full flex flex-col gap-10 px-12 ${
          isMenuItemModalOpen || isCategoryModalOpen ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="h-fit w-full flex-wrap flex justify-center sm:justify-between items-center gap-4">
          <div className="text-2xl ">Categories</div>
          <button
            onClick={() => {
              setIsCategoryModalOpen(true);
            }}
            className="bg-custom-pink px-4 py-2 text-black  rounded-lg"
          >
            Add New Category
          </button>
        </div>
        <div className="w-full h-fit flex flex-wrap items-center justify-center gap-5">
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
                      {
                        menuItems.filter(
                          (menuItem) =>
                            menuItem.itemCategory.toString() ===
                            item._id.toString()
                        ).length
                      }{" "}
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
                      {
                        menuItems.filter(
                          (menuItem) =>
                            menuItem.itemCategory.toString() ===
                            item._id.toString()
                        ).length
                      }{" "}
                      items
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      <div
        className={`${
          isMenuItemModalOpen || isCategoryModalOpen
            ? "hidden sm:block"
            : "block"
        }`}
      >
        <div className="text-2xl w-full text-center px-0 sm:w-fit sm:px-12 mb-10">
          Special menu all items
        </div>
        <div className="mx-12 flex flex-col lg:flex-row justify-between items-center mb-10 gap-3 ">
          <div className="flex flex-col lg:flex-row lg:justify-center gap-6">
            <button
              className={`px-4 py-2 rounded-lg ${
                isSelectedMenu === "normal"
                  ? "bg-custom-pink text-black"
                  : "bg-custom-bg"
              }`}
              onClick={() => setIsSelectedMenu("normal")}
            >
              Normal Menu
            </button>

            <button
              className={`px-4 py-2 rounded-lg ${
                isSelectedMenu === "specialDeals"
                  ? "bg-custom-pink text-black"
                  : "bg-custom-bg"
              }`}
              onClick={() => setIsSelectedMenu("specialDeals")}
            >
              Special Deals
            </button>

            <button
              className={`px-4 py-2 rounded-lg ${
                isSelectedMenu === "newYearDeals"
                  ? "bg-custom-pink text-black"
                  : "bg-custom-bg"
              }`}
              onClick={() => setIsSelectedMenu("newYearDeals")}
            >
              New Year Deals
            </button>
          </div>

          <hr
            className={`mt-3 mb-2 w-full lg:hidden border-2 border-custom-input-bg `}
          />
          <button
            onClick={() => {
              setSelectedItem(null);
              setIsMenuItemModalOpen(true);
            }}
            className="bg-custom-pink px-4 py-2 text-black  rounded-lg"
          >
            Add Menu Item
          </button>
        </div>
        <div className="w-full h-fit">
          <div className="w-full h-fit flex flex-col ">
            <div className="w-full h-fit gap-12 mb-4  hidden sm:flex items-center justify-center">
              <div className="ml-4 w-fit h-fit">
                <input
                  checked={!Object.values(checkedItems).includes(false)}
                  onChange={handleToggleAll}
                  type="checkbox"
                  name=""
                  id=""
                />
              </div>
              <div className="w-20">Product</div>
              <div className="w-80">Product Name</div>
              <div className="w-20">Stock</div>
              <div className="w-20">Category</div>
              <div className="w-20">Price</div>
              <div className="w-20">Availability</div>
              <div className="w-14"></div>
            </div>
            {filteredMenuItems.map((item, index) => (
              <div
                key={item._id}
                className={`w-full h-fit flex flex-col sm:flex-row items-center justify-center py-7 gap-2 sm:gap-12 sm:py-4 ${
                  index % 2 === 0 ? `bg-custom-input-bg` : `bg-custom-bg-2`
                }`}
              >
                <div className="ml-4 w-fit h-fit sm:block hidden">
                  <input
                    checked={checkedItems[item._id] || false}
                    onChange={() => handleToggle(item._id)}
                    type="checkbox"
                    name=""
                    id=""
                  />
                </div>
                <div className="w-20">
                  <img
                    className="h-20 w-20 rounded-md"
                    src={item.image}
                    alt=""
                  />
                </div>
                <div className="sm:w-80">
                  <div className="font-semibold sm:font-normal sm:text-sm sm:mb-2">
                    {item.itemName}
                  </div>
                  <div className="text-custom-desc-color text-sm sm:block hidden">
                    {item.itemDesc}
                  </div>
                </div>
                <div className="sm:w-20 text-sm flex">
                  <span className="text-custom-desc-color block sm:hidden">
                    Stock&nbsp;:&nbsp;{" "}
                  </span>
                  {item.stock}&nbsp;items
                </div>
                <div className="sm:w-20 text-sm flex sm:block">
                  <span className="text-custom-desc-color block sm:hidden">
                    Category&nbsp;:&nbsp;{" "}
                  </span>
                  {categories.find(
                    (category) =>
                      category._id.toString() === item.itemCategory.toString()
                  )?.name || "unknown"}
                </div>
                <div className="sm:w-20 text-sm flex sm:block">
                  <span className="text-custom-desc-color block sm:hidden">
                    Price&nbsp;:&nbsp;{" "}
                  </span>
                  &#8377;{item.itemPrice}
                </div>
                <div
                  className={`sm:w-20 text-sm ${
                    item.itemAvailability ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.itemAvailability ? "In Stock" : "Out of Stock"}
                </div>
                <div className="flex gap-3 sm:gap-0 sm:justify-between sm:w-14">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsMenuItemModalOpen(true);
                    }}
                  >
                    <img src={editIcon} alt="" />
                  </button>
                  <button onClick={() => handleDelete(item._id)}>
                    <img src={deleteIcon} alt="" />
                  </button>
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="text-xs bg-custom-pink text-black px-2 py-1 rounded-md block sm:hidden"
                  >
                    {checkedItems[item.id]
                      ? "Remove this item"
                      : "Add this item"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ItemModal
        isOpen={isMenuItemModalOpen}
        onClose={() => setIsMenuItemModalOpen(false)}
        data={{ item: selectedItem, categories }}
        onSave={() => fetchData()} // Refresh menu after adding/updating
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={() => fetchData()}
      />
    </section>
  );
};

export default Menu;
