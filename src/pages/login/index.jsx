/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login",
        { email, password },
        { headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" } }
      );
      const token = response.data.token;
      setCookie("token", token);
      setCookie("role", response.data.data.role);
      setSuccess("Login success! Please wait...");
      setTimeout(() => {
        setSuccess(null);
        router.push("/");
        setTimeout(() => {
          router.reload();
        }, 500); // Redirect ke halaman utama setelah 3 detik
      }, 3000);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <>
      {isMobileView ? (
        <>
          <section className=" h-[75vh] md:h-[70vh] flex-col p-8 flex-center md:bg-[url('https://images.pexels.com/photos/29340467/pexels-photo-29340467/free-photo-of-stunning-sunset-clouds-in-georgia-sky.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] md:bg-cover">
            <div className="flex flex-col gap-8 md:p-8 md:rounded-xl md:m-8 md:bg-[#F2F2F2] md:shadow-xl md:shadow-[#393e46]">
              <p className="text-2xl text-center font-bold text-[#F96D00]">Login to your account</p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="email">Email</label>

                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="password">Password</label>

                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <button type="submit" className="w-full mt-4 btn-1">
                  Login
                </button>

                <p className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-[#F96D00] nav-link-1">
                    Register here
                  </Link>
                  .
                </p>
              </form>

              {error && (
                <p className="text-red-500 bg-[#f2f2f2] border-red-500 border-2 rounded-lg p-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-500 bg-[#f2f2f2] border-green-500 border-2 rounded-lg p-2">
                  {success}
                </p>
              )}
            </div>
          </section>
        </>
      ) : (
        // Desktop View
        <>
          <section className="px-64 py-24 bg-[url('https://images.pexels.com/photos/29340467/pexels-photo-29340467/free-photo-of-stunning-sunset-clouds-in-georgia-sky.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover">
            <div className="h-full grid grid-cols-2 shadow-2xl shadow-[#393e46] rounded-2xl">
              {/* Gambar dengan overlay */}
              <div className="relative w-full h-full bg-[url('https://images.pexels.com/photos/6976002/pexels-photo-6976002.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover rounded-l-xl">
                <div className="absolute inset-0 bg-black opacity-30 rounded-l-xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-3xl font-bold text-center text-[#f2f2f2]">
                    Create Memories, <br /> Share Stories.
                  </h2>
                </div>
              </div>

              {/* Form Login */}
              <form
                onSubmit={handleLogin}
                className="flex flex-col justify-center gap-4 p-16 bg-[#f2f2f2] rounded-r-xl">
                <p className="text-2xl text-center font-bold text-[#F96D00]">
                  Login to your account
                </p>

                <div className="flex flex-col">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <button type="submit" className="w-full mt-4 btn-1">
                  Login
                </button>

                <p className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-[#F96D00] nav-link-1">
                    Register here
                  </Link>
                  .
                </p>

                {error && (
                  <p className="text-red-500 bg-[#f2f2f2] border-red-500 border-2 rounded-lg p-2">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-green-500 bg-[#f2f2f2] border-green-500 border-2 rounded-lg p-2">
                    {success}
                  </p>
                )}
              </form>
            </div>
          </section>
        </>
      )}
    </>
  );
}
