import Link from "next/link";
import { useState } from "react";

export default function Sidebar({ onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    if (onToggle) onToggle(!isExpanded); // Kirim status sidebar ke parent component
  };

  const menuItems = [
    { name: "Back to main website", href: "/", icon: "chevron-back" },
    { name: "Dashboard", href: "/dashboard", icon: "home" },
    { name: "Manage Users", href: "/dashboard/users", icon: "people" },
    { name: "Manage Banner", href: "/dashboard/banner", icon: "images" },
    { name: "Manage Categories", href: "/dashboard/categories", icon: "grid" },
    { name: "Manage Activities", href: "/dashboard/activities", icon: "rocket" },
    { name: "Manage Promo", href: "/dashboard/promo", icon: "pricetags" },
    { name: "Manage Transaction", href: "/dashboard/transactions", icon: "cash" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#222831] text-white shadow-lg transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}>
      {/* Sidebar Toggle Button */}
      <button
        className="absolute top-4 right-[-12px] bg-[#393E46] text-white w-6 h-6 rounded-full flex items-center justify-center"
        onClick={toggleSidebar}>
        <ion-icon name={isExpanded ? "chevron-back" : "chevron-forward"} />
      </button>

      {/* Sidebar Content */}
      <div className="flex flex-col items-start gap-4 p-4 mt-10">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-4 p-2 rounded-lg hover:bg-[#393E46] w-full transition-all duration-200 ${
              isExpanded ? "justify-start" : "justify-center"
            }`}>
            <ion-icon name={item.icon} className="text-2xl" />
            {isExpanded && <span className="text-sm">{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
