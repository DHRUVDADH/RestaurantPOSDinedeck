import React, { useState, useEffect } from "react";
import closeArrowIcon from "../assets/close_arrow.svg";
import axios from "axios";
import { toast } from "react-toastify";

const ItemModal = ({ isOpen, onClose, data, onSave }) => {
  const { item, categories } = data || {};

  const [itemName, setItemName] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(""); // ✅ NEW: Separate preview image state
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemAvailability, setItemAvailability] = useState(true);
  const [stock, setStock] = useState(0);
  const [dealType, setDealType] = useState("Normal Menu");

  const isEditMode = item !== null;

  useEffect(() => {
    if (isEditMode && item) {
      setItemName(item.itemName);
      setItemDesc(item.itemDesc);
      setItemPrice(item.itemPrice);
      setItemCategory(item.itemCategory);
      setItemAvailability(item.itemAvailability);
      setStock(item.stock);
      setDealType(item.dealType);
      setPreviewImage(item.image || ""); // ✅ Ensure preview is set correctly
    } else {
      setItemName("");
      setItemDesc("");
      setItemPrice("");
      setItemCategory("");
      setItemAvailability(true);
      setStock(0);
      setDealType("Normal Menu");
      setPreviewImage("");
    }
  }, [isEditMode, item]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // ✅ NEW: Update preview image
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("itemName", itemName);
    formData.append("itemDesc", itemDesc);
    formData.append("stock", parseFloat(stock));
    formData.append("itemPrice", parseFloat(itemPrice));
    formData.append("itemAvailability", itemAvailability);
    formData.append("itemCategory", itemCategory);
    formData.append("dealType", dealType);

    if (image) {
      formData.append("image", image);
    } else if (isEditMode && item.image) {
      formData.append("imageUrl", item.image);
    } else {
      toast.error("Please upload an image");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("🚨 No token found in localStorage!");
        return;
      }

      let response;
      if (isEditMode) {
        response = await axios.patch(
          `http://localhost:8000/api/v1/menu/update-item-details/${item._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/api/v1/menu",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success(
        isEditMode ? "Item Updated Successfully" : "Item Added Successfully"
      );
      onSave(response.data.updatedItem || response.data.newItem);
      onClose();
    } catch (error) {
      console.error("❌ Error Updating Item:", error.response?.data || error);
      toast.error("Error Updating Item");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 w-full h-fit flex items-center justify-end bg-black bg-opacity-40 overflow-y-auto z-50">
      <div className="h-full w-full flex flex-col items-center justify-center sm:block sm:w-fit py-6 sm:rounded-lg bg-custom-bg-2">
        <div className="flex justify-between w-full items-center mb-6 px-20 sm:px-10 pb-8 pt-4 border-b-2">
          {" "}
          <h2 className="sm:text-2xl text-lg">
            {isEditMode ? "Update Item" : "Add New Item"}
          </h2>
          <div
            onClick={onClose}
            className="cursor-pointer p-3/4 sm:p-1 rounded-full bg-custom-input-bg"
          >
            <img
              className="scale-90 sm:scale-100"
              src={closeArrowIcon}
              alt=""
            />
          </div>
        </div>
        <div className="h-fit w-fit flex flex-col items-center mx-10 gap-2">
          <div className="bg-custom-input-bg w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] overflow-hidden rounded-xl">
            {previewImage ? (
              <img
                className="sm:h-[200px] sm:w-[200px] object-cover"
                src={previewImage}
                alt="Preview"
              />
            ) : (
              <p className="flex justify-center items-center h-full w-full text-gray-500">
                No Image
              </p>
            )}
          </div>
          <label
            htmlFor="imagefile"
            className="text-sm underline underline-offset-2 text-custom-pink cursor-pointer"
          >
            Change Image
          </label>
          <input
            onChange={handleImageUpload}
            id="imagefile"
            className="hidden"
            type="file"
          />
        </div>
        <div className="sm:w-[450px] w-[280px] mx-10 mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="name">
            Item Name
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="name"
            placeholder="Enter Item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div className="sm:w-[450px] w-[280px] mx-10 mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="description">
            Item Description
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="description"
            placeholder="Enter Item Description"
            value={itemDesc}
            onChange={(e) => setItemDesc(e.target.value)}
            required
          />
        </div>
        <div className="sm:w-[450px] w-[280px] mx-10 mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="price">
            Item Price
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="price"
            placeholder="Enter Item Price"
            value={itemPrice}
            onChange={(e) => setItemPrice(Number(e.target.value))}
            required
          />
        </div>
        <div className="sm:w-[450px] w-[280px] mx-10 mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="deal">
            Category Deal Type
          </label>
          <select
            id="deal"
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            value={dealType}
            onChange={(e) => setDealType(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Deal Type
            </option>
            <option value="Normal Menu">Normal Menu</option>
            <option value="Special Deals">Special Deals</option>
            <option value="New Year Deals">New Year Deals</option>
          </select>
        </div>
        <div className="sm:w-[450px] w-[280px] mx-10 mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="description">
            Item Category
          </label>
          <select
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="description"
            placeholder="Enter Item category"
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
            required
          >
            <option value="">Select A Category</option>
            {categories?.map((category, index) => (
              <option key={index} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:w-[450px] w-[280px] mx-10 mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="available">
            Item Availability
          </label>
          <select
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            value={itemAvailability ? "true" : "false"}
            onChange={(e) => setItemAvailability(e.target.value === "true")}
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
        <div className="sm:w-[450px] w-[280px] mx-10 mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="stock">
            Item Stock
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="stock"
            placeholder="Enter Item Stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex sm:flex-row flex-col justify-end space-x-2 mt-12 sm:mr-12">
          <button
            onClick={onClose}
            className="px-8 py-4 underline underline-offset-1 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-4 text-sm bg-custom-pink text-black rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
