/* eslint-disable @next/next/no-img-element */
import { CategoriesContext } from "@/contexts/CategoriesContext";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next";
import axios from "axios";
import Loading from "../Loading";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const { categories, loading, error } = useContext(CategoriesContext);
  const [userRole, setUserRole] = useState(null); // Tambahkan state untuk role

  useEffect(() => {
    const tokenFromCookie = getCookie("token");
    setToken(tokenFromCookie);

    if (tokenFromCookie) {
      fetchUserRole(tokenFromCookie);
    }
  }, []);

  const fetchUserRole = async (token) => {
    try {
      const { data } = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserRole(data.data.role); // Simpan role user
    } catch (err) {
      console.error("Failed to fetch user role:", err);
    }
  };

  const toggleProfile = () => {
    if (token) {
      setOpenProfile((prev) => !prev);
    } else {
      router.push("/login");
    }
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/");
    setTimeout(() => {
      router.reload();
    }, 100);
    setToken(null);
    setDropdownOpen(false);
    setOpenProfile(false);
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-[#393E46] text-[#F2F2F2] sticky top-0 z-most-front-20th">
      <div className="relative">
        <nav className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <MobileMenuButton isOpen={isOpen} toggleMenu={toggleMenu} />

          {/* Mobile Menu Drawer */}
          <MobileMenu
            isOpen={isOpen}
            toggleMenu={toggleMenu}
            categories={categories}
            token={token}
            handleLogout={handleLogout}
          />

          {/* Logo */}
          <Link href="/" className="flex-center w-[125px] hidden lg:flex">
            <img src="/logo/tripnest-logo-text.png" alt="TripNest" />
          </Link>

          {/* Search Bar */}
          <SearchBar />

          {/* Desktop Menu */}
          <DesktopMenu
            categories={categories}
            dropdownOpen={dropdownOpen}
            toggleDropdown={toggleDropdown}
          />

          {/* Auth Links (Register/Login) */}
          <AuthLinks token={token} handleLogout={handleLogout} />

          {/* Account Menu */}
          <AccountButton toggleProfile={toggleProfile} />
          <AccountMenu
            openProfile={openProfile}
            setOpenProfile={setOpenProfile}
            userRole={userRole} // Pass role to AccountMenu
          />
        </nav>
      </div>
    </div>
  );
}

// Components

function MobileMenuButton({ isOpen, toggleMenu }) {
  return (
    <button className="text-3xl flex-center lg:hidden" onClick={toggleMenu}>
      <ion-icon name={isOpen ? "close" : "menu"} />
    </button>
  );
}

function MobileMenu({ isOpen, toggleMenu, categories, token, handleLogout }) {
  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-most-front-19th"
            onClick={toggleMenu}
          />
          <button
            onClick={toggleMenu}
            className="absolute w-fit h-screen top-[25%] left-[75%] md:left-[72%] z-most-front-17th flex-center">
            <ion-icon name="close" className="text-6xl" />
          </button>
        </>
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-[#393E46] w-2/3 md:w-1/2 z-most-front-18th transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out`}>
        <div
          className="flex flex-col justify-center h-full gap-4 p-4 text-lg md:text-2xl md:p-8 ```javascript
        md:gap-4">
          <Logo toggleMenu={toggleMenu} />

          <div className="flex flex-col gap-2">
            <NavLink href="/" icon="home" text="Home" toggleMenu={toggleMenu} />
            <NavLink href="/categories" icon="grid" text="Categories" toggleMenu={toggleMenu} />

            <div className="flex flex-row justify-between h-[20vh] md:h-[30vh] gap-4">
              <div className="flex flex-col w-full gap-2 overflow-y-auto md:gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="gap-2 ml-6 mobile-nav-link"
                    onClick={toggleMenu}>
                    <span>•</span>
                    <p>{category.name}</p>
                  </Link>
                ))}
                <Link
                  href="/categories"
                  className="gap-2 ml-6 mobile-nav-link"
                  onClick={toggleMenu}>
                  <span>•</span>
                  <p>View All</p>
                </Link>
              </div>
              <CategoryScrollArrows />
            </div>

            <NavLink href="/help" icon="help-circle" text="Help Center" toggleMenu={toggleMenu} />
            <NavLink href="/about" icon="information-circle" text="About" toggleMenu={toggleMenu} />
          </div>

          <div>
            {token ? (
              <button onClick={handleLogout} className="w-full btn-2 flex-center">
                Logout
              </button>
            ) : (
              <AuthButtons toggleMenu={toggleMenu} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DesktopMenu({ categories }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <div className="flex-row hidden gap-4 flex-center lg:flex">
      <NavLink href="/" icon="home" text="Home" />
      <div className="relative">
        <button onClick={toggleDropdown} className="flex items-center mobile-nav-link">
          <ion-icon name="grid" />
          <p>Categories</p>
          <ion-icon name="chevron-down" />
        </button>
        <div
          className={`absolute top-[150%] right-0 w-48 bg-[#393E46] border border-[#CECECE] rounded-lg shadow-xl shadow-[#222831] transition-all duration-300 ease-in-out ${
            dropdownOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          } overflow-y-auto`}
          style={{
            transform: dropdownOpen ? "translateY(0)" : "translateY(-10px)",
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}>
          <div className="flex flex-col gap-4 p-4 text-sm text-[#F2F2F2]">
            <NavLink href="/categories" icon="grid" text="View All" toggleMenu={toggleDropdown} />
            {categories.map((category) => (
              <NavLink
                key={category.id}
                href={`/categories/${category.id}`}
                icon="grid"
                text={category.name}
                toggleMenu={toggleDropdown}
              />
            ))}
          </div>
        </div>
      </div>
      <NavLink href="/help" icon="help-circle" text="Help Center" />
      <NavLink href="/about" icon="information-circle" text="About" />
    </div>
  );
}

function AuthLinks({ token, handleLogout }) {
  return (
    <div className="flex-row hidden gap-2 text-sm flex-center lg:flex">
      {token ? (
        <button onClick={handleLogout} className="btn-2 flex-center">
          Logout
        </button>
      ) : (
        <>
          <Link href="/login" className="btn-2 flex-center">
            Login
          </Link>
          <Link href="/register" className="btn-1 flex-center">
            Register
          </Link>
        </>
      )}
    </div>
  );
}

function AccountButton({ toggleProfile }) {
  return (
    <button
      className="text-3xl flex-center lg:text-xl lg:p-2 rounded-full border-2 border-transparent lg:border-[#f2f2f2] lg:border-opacity-50 lg:hover:bg-[#222831]"
      onClick={toggleProfile}>
      <ion-icon name="person" />
    </button>
  );
}

function AccountMenu({ openProfile, setOpenProfile, userRole }) {
  const router = useRouter();

  const handleLinkClick = (path) => {
    router.push(path);
    setOpenProfile(false);
  };

  return (
    <div
      className={`absolute top-[110%] right-[1%] w-48 bg-[#393E46] border border-[#CECECE] rounded-lg shadow-xl shadow-[#222831] transition-all duration-300 ease-in-out ${
        openProfile ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
      } overflow-hidden`}
      style={{
        transform: openProfile ? "translateY(0)" : "translateY(-10px)",
        transition: "transform 0.3s ease, opacity 0.3s ease",
      }}>
      <div className="flex flex-col gap-4 p-4 text-[#F2F2F2]">
        {userRole === "admin" ? (
          <>
            <Link
              href="/profile"
              className="border-b-2 border-[#f2f2f2] border-opacity-30 nav-link-1"
              onClick={() => handleLinkClick("/profile")}>
              <div className="flex items-center gap-2">
                <ion-icon name="person-circle" />
                <p>Profile</p>
              </div>
            </Link>
            <Link
              href="/dashboard"
              className="border-b-2 border-[#f2f2f2] border-opacity-30 nav-link-1"
              onClick={() => handleLinkClick("/dashboard")}>
              <div className="flex items-center gap-2">
                <ion-icon name="key" />
                <p>Dashboard</p>
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/profile"
              className="border-b-2 border-[#f2f2f2] border-opacity-30 nav-link-1"
              onClick={() => handleLinkClick("/profile")}>
              <div className="flex items-center gap-2">
                <ion-icon name="person-circle" />
                <p>Profile</p>
              </div>
            </Link>
            <Link
              href="/cart"
              className="border-b-2 border-[#f2f2f2] border-opacity-30 nav-link-1"
              onClick={() => handleLinkClick("/cart")}>
              <div className="flex items-center gap-2">
                <ion-icon name="cart" />
                <p>Cart</p>
              </div>
            </Link>
            <Link
              href="/my-transaction"
              className="border-b-2 border-[#f2f2f2] border-opacity-30 nav-link-1"
              onClick={() => handleLinkClick("/my-transaction")}>
              <div className="flex items-center gap-2">
                <ion-icon name="cash" />
                <p>My Transaction</p>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// Helper Components
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);
  const router = useRouter();

  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesRes, categoriesRes] = await Promise.all([
          axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", {
            headers: { apiKey },
          }),
          axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", {
            headers: { apiKey },
          }),
        ]);
        setActivities(activitiesRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filteredActivities = activities.filter((activity) =>
      activity.title.toLowerCase().includes(lowerCaseTerm)
    );
    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(lowerCaseTerm)
    );
    setResults([...filteredCategories, ...filteredActivities].slice(0, 5));
  }, [searchTerm, activities, categories]);

  const handleItemClick = (item) => {
    if (item.title) {
      router.push(`/activities/${item.id}`);
    } else {
      router.push(`/categories/${item.id}`);
    }
    setSearchTerm("");
  };

  return (
    <div className="relative w-full md:w-2/3 lg:w-1/4">
      <input
        type="text"
        placeholder="Search categories or activities..."
        className="w-full px-4 py-2 rounded-lg bg-[#F2F2F2] text-[#222831]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full overflow-y-auto bg-white text-[#222831] border rounded-lg shadow-md max-h-48">
          {results.map((item) => (
            <li
              key={item.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 border-2 border-[#cecece]"
              onClick={() => handleItemClick(item)}>
              {item.title || item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NavLink({ href, icon, text, toggleMenu }) {
  return (
    <Link href={href} className="mobile-nav-link" onClick={toggleMenu}>
      <div className="flex items-center gap-2">
        <div className="flex-center">
          <ion-icon name={icon} />
        </div>
        <p>{text}</p>
      </div>
    </Link>
  );
}

function Logo({ toggleMenu }) {
  return (
    <Link href="/" onClick={toggleMenu} className="flex-col mx-auto flex-center">
      <img src="/logo/tripnest-logo.png" alt="TripNest" className="w-[75px]" />
      <img src="/logo/tripnest-logo-text.png" alt="TripNest" className="w-[125px]" />
    </Link>
  );
}

function CategoryScrollArrows() {
  return (
    <div className="flex flex-col items-center justify-center w-8 gap-2">
      <ion-icon name="chevron-up-outline" className="hover:text-[#222831]" />
      <div className="h-full w-1 rounded-full bg-[#f2f2f2]" />
      <ion-icon name="chevron-down-outline" className="hover:text-[#222831]" />
    </div>
  );
}

function AuthButtons({ toggleMenu }) {
  return (
    <div className="flex flex-row justify-center w-full gap-4">
      <Link href="/register" className="w-full btn-1 flex-center" onClick={toggleMenu}>
        Register
      </Link>
      <Link href="/login" className="w-full btn-2 flex-center" onClick={toggleMenu}>
        Login
      </Link>
    </div>
  );
}
