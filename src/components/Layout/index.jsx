import { useRouter } from "next/router";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Sidebar from "../Sidebar";

export default function Layout({ children }) {
  const router = useRouter();

  // Define pages that should not have a layout
  const noLayoutPages = [
    "/dashboard",
    "/dashboard/users",
    "/dashboard/banner",
    "/dashboard/categories",
    "/dashboard/activities",
    "/dashboard/promo",
    "/dashboard/payment",
    "/dashboard/transactions",
  ];

  // Check if the current path matches any of the noLayoutPages
  const isNoLayoutPage = noLayoutPages.some((path) => router.pathname.startsWith(path));

  if (isNoLayoutPage) {
    // If it's a no-layout page, render children without layout
    return (
      <>
        <Sidebar />
        {children}
      </>
    );
  }

  // Otherwise, render children with layout
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
