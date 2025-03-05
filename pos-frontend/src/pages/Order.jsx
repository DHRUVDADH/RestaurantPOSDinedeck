import React, { useState , useEffect} from "react";
import axios from "axios";

const Order = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

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

    } catch (error) {}
  };

   useEffect(() => {
      fetchData();
    }, []);

  return (
    <section>
      <div>
        <div></div>
        <div>
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
      <div></div>
    </section>
  );
};

export default Order;
