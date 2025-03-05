import React, { useState } from "react";
import axios from "axios";
import closeArrowIcon from "../assets/close_arrow.svg";
import { toast } from "react-toastify";

const CategoryModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [description, setDescription] = useState("");
  const [dealType, setDealType] = useState("");

  const handleImageUpload = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Show preview
      setImage(file); // Store actual file
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("dealType", dealType);

    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage!");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/v1/categories/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Category Added Successfully");
      onSave(response.data.updatedItem || response.data.newItem);
      onClose();
    } catch (error) {
      console.error("Error Updating Item:", error.response?.data || error);
      toast.error("Error Updating Item");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 w-full h-screen flex items-center justify-end bg-black bg-opacity-40 overflow-y-auto">
      <div className="h-full w-fit py-6 rounded-lg bg-custom-bg-2">
        <div className="flex justify-between w-full items-center mb-6 px-10 pb-8 pt-4 border-b-2">
          <h2 className="text-2xl">Create New Category</h2>
          <div
            onClick={onClose}
            className="cursor-pointer p-1 rounded-full bg-custom-input-bg"
          >
            <img src={closeArrowIcon} alt="" />
          </div>
        </div>

        <div className="flex">
          {[
            {
              id: "imagefile1",
              image: preview1,
              setImage: setImage1,
              setPreview: setPreview1,
            },
            {
              id: "imagefile2",
              image: preview2,
              setImage: setImage2,
              setPreview: setPreview2,
            },
          ].map((img, index) => (
            <div
              key={index}
              className="h-fit w-fit flex flex-col items-center mx-10 gap-2"
            >
              <div className="bg-custom-input-bg w-[200px] h-[200px] overflow-hidden rounded-xl">
                {img.image ? (
                  <img
                    className="h-[200px] w-[200px] object-cover"
                    src={img.image}
                    alt="Preview"
                  />
                ) : (
                  <p className="flex justify-center items-center h-full w-full text-gray-500">
                    No Image
                  </p>
                )}
              </div>
              <label
                htmlFor={img.id}
                className="text-sm underline underline-offset-2 text-custom-pink cursor-pointer"
              >
                Change Image
              </label>
              <input
                onChange={(e) =>
                  handleImageUpload(e, img.setImage, img.setPreview)
                }
                id={img.id}
                className="hidden"
                type="file"
              />
            </div>
          ))}
        </div>

        <div className="sm:w-[450px] w-[280px] mx-10 mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="name">
            Category Name
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="name"
            placeholder="Enter Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="sm:w-[450px] w-[280px] mx-10 mt-12 flex flex-col items-start">
          <label className="text-[11px] ml-1" htmlFor="description">
            Category Description
          </label>
          <input
            className="bg-custom-input-bg rounded-md w-full px-2 py-2 mt-1"
            type="text"
            id="description"
            placeholder="Enter Category Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        

        <div className="flex justify-end space-x-2 mt-12 mr-12">
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

export default CategoryModal;
