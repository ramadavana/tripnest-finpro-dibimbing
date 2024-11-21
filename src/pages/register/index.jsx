/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Fungsi untuk mendeteksi lebar layar
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  // Upload Image
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
        formData,
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      );
      return response.data.url;
    } catch (err) {
      setError("Image upload failed.");
      setTimeout(() => setError(null), 3000);
      return null;
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register",
        {
          name,
          email,
          password,
          passwordRepeat,
          role: "user",
          profilePictureUrl: imageUrl,
          phoneNumber,
        },
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      );
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError("Registration failed. Please check your inputs.");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <>
      {isMobileView ? (
        <section
          className="relative w-screen bg-center bg-cover md:py-16"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1731351621470-8aebda14d242?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          }}>
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="relative z-10 flex-center">
            <div className="bg-[#f2f2f2] p-8 md:p-12 md:rounded-xl flex flex-col gap-4 shadow-xl shadow-[#393e46]">
              <h2 className="text-2xl font-bold text-center text-[#f96d00]">Create an Account</h2>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-[#222831]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="text-[#222831]">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phoneNumber" className="text-[#222831]">
                    Phone Number
                  </label>

                  <input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="image" className="text-[#222831]">
                    Profile Picture
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="password" className="text-[#222831]">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="passwordRepeat" className="text-[#222831]">
                    Repeat Password
                  </label>

                  <input
                    type="password"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <button type="submit" className="w-full mt-4 btn-1">
                  Register
                </button>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}
              </form>
              <p className="mt-4 text-sm text-center text-[#222831]">
                Already have an account?{" "}
                <Link href="/login" className="nav-link-1 text-[#f96d00]">
                  Login here
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-2 min-h-screen bg-[url('https://images.pexels.com/photos/5253574/pexels-photo-5253574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center p-32 xl:px-64 shadow-2xl shadow-[#393e46]">
          {/* Left Side - Image with text */}
          <div className="relative flex items-center justify-center bg-[#f2f2f2] rounded-l-xl">
            <div className="absolute inset-0 rounded-l-xl">
              <img
                src="https://images.pexels.com/photos/5490306/pexels-photo-5490306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Image"
                className="object-cover w-full h-full rounded-l-xl filter brightness-50"
              />
            </div>
            <h1 className="relative z-10 text-4xl font-bold text-center text-white">
              Stop sitting around,
              <br />
              <span className="text-[#f96d00]">
                {" "}
                Explore the World <br />
                with Us
              </span>
            </h1>
          </div>

          {/* Right Side - Form */}
          <div className="flex items-center justify-center bg-[#f2f2f2] rounded-r-xl p-12 shadow-xl shadow-[#393e46]">
            <div className="flex flex-col w-full max-w-md gap-4">
              <h2 className="text-2xl font-bold text-center text-[#f96d00]">Create an Account</h2>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-[#222831]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="text-[#222831]">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phoneNumber" className="text-[#222831]">
                    Phone Number
                  </label>

                  <input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="image" className="text-[#222831]">
                    Profile Picture
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="password" className="text-[#222831]">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="passwordRepeat" className="text-[#222831]">
                    Repeat Password
                  </label>

                  <input
                    type="password"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    className="w-full p-2 border rounded-lg text-[#222831]"
                    required
                  />
                </div>

                <button type="submit" className="w-full mt-4 btn-1">
                  Register
                </button>
              </form>

              {error && (
                <p className="p-4 mt-4 text-red-500 border-2 border-red-500 bg-[#f2f2f2] rounded-lg">
                  {error}
                </p>
              )}

              {success && (
                <p className="p-4 mt-4 text-green-500 border-2 border-green-500 bg-[#f2f2f2] rounded-lg">
                  {success}
                </p>
              )}

              <p className="mt-4 text-sm text-center text-[#222831]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#f96d00] hover:underline">
                  Login here
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
