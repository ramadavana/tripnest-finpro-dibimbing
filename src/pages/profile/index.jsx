/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePictureUrl: "",
    phoneNumber: "",
  });
  const [imageFile, setImageFile] = useState(null); // State for the image file

  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const token = getCookie("token");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user",
          {
            headers: {
              apiKey,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.data); // Set data user
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          profilePictureUrl: response.data.data.profilePictureUrl,
          phoneNumber: response.data.data.phoneNumber,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
        formData,
        {
          headers: { apiKey },
        }
      );
      return response.data.url; // Return the uploaded image URL
    } catch (err) {
      setError("Image upload failed.");
      setTimeout(() => setError(null), 3000);
      return null;
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = "";
      // Upload image if a file is selected
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile);
      }

      // Update user profile
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile",
        {
          ...formData,
          profilePictureUrl: uploadedImageUrl || formData.profilePictureUrl, // Use the new URL if available
        },
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user state with new data
      setUser((prevUser) => ({
        ...prevUser,
        profilePictureUrl: uploadedImageUrl || prevUser.profilePictureUrl,
      }));
      setIsEditing(false); // Close edit mode
      alert("Profile updated successfully!");
      fetchUserData();
    } catch (err) {
      console.error(err);
      setError("Failed to update user data.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <section className="p-6 md:p-12 md:py-16 bg-[#f2f2f2]">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md md:max-w-lg">
        <div className="p-4 md:p-12">
          <div className="flex items-center space-x-4 md:space-x-8">
            <img
              src={user.profilePictureUrl}
              alt="Profile"
              className="object-cover w-[100px] md:w-[150px] h-[100px] md:h-[150px] rounded-full"
            />

            <div>
              <h1 className="text-xl font-bold md:text-2xl">{user.name}</h1>

              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="mt-4">
            <p>
              <strong>Role:</strong> {user.role}
            </p>

            <p>
              <strong>Phone:</strong> {user.phoneNumber || "Not Provided"}
            </p>
          </div>
          <button onClick={handleEditToggle} className="px-4 py-2 mt-4 btn-1">
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          {isEditing && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-lg border-[#393e46]"
                />
              </div>

              <div>
                <label className="block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-lg border-[#393e46]"
                />
              </div>

              <div>
                <label className="block">Profile Picture URL</label>
                <input
                  type="text"
                  name="profilePictureUrl"
                  value={formData.profilePictureUrl}
                  readOnly
                  className="w-full p-2 border rounded-md shadow-lg border-[#393e46]"
                />
              </div>

              <div>
                <label className="block">Upload New Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md shadow-lg border-[#393e46]"
                />
              </div>

              <div>
                <label className="block">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-lg border-[#393e46]"
                />
              </div>

              <button type="submit" className="px-4 py-2 mt-4 btn-1">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
