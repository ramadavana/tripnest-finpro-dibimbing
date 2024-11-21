import Link from "next/link";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
export default function Footer() {
  const [notification, setNotification] = useState("");

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setNotification("Number copied to clipboard!");
        setTimeout(() => setNotification(""), 2000); // Notifikasi hilang setelah 2 detik
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  const year = new Date().getFullYear();

  const socialLinks = [
    {
      id: 1,
      name: "Facebook",
      url: "https://www.facebook.com/",
      icon: "logo-facebook",
    },

    {
      id: 2,
      name: "Instagram",
      url: "https://www.instagram.com/",
      icon: "logo-instagram",
    },

    {
      id: 3,
      name: "Twitter",
      url: "https://twitter.com/",
      icon: "logo-twitter",
    },

    {
      id: 4,
      name: "GitHub",
      url: "https://www.github.com/",
      icon: "logo-github",
    },

    {
      id: 5,
      name: "Play Store",
      url: "https://www.play.google.com/",
      icon: "logo-google-playstore",
    },

    {
      id: 6,
      name: "App Store",
      url: "https://www.apple.com/",
      icon: "logo-apple-appstore",
    },
  ];

  const usefulLinks = [
    {
      id: 1,
      name: "How to Order",
      url: "/help",
      icon: "information-circle",
    },

    {
      id: 2,
      name: "Feedback",
      url: "/help",
      icon: "archive",
    },

    {
      id: 3,
      name: "About Us",
      url: "/about",
      icon: "business",
    },
  ];

  return (
    <>
      <div className="bg-[#393E46] text-[#F2F2F2] p-4">
        <footer className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="flex-col flex-center">
            <img
              src="/logo/tripnest-logo.png"
              alt="TripNest Logo"
              className="w-[50px] md:w-[75px]"
            />

            <img
              src="/logo/tripnest-logo-text.png"
              alt="TripNest Logo Text"
              className="w-[125px] md:w-[150px]"
            />
          </div>

          <div className="flex-col items-center hidden gap-2 md:flex lg:col-span-2 border-2 border-transparent lg:border-[#F2F2F2] lg:p-4 lg:rounded-xl lg:border-opacity-20">
            <p className="foot-menu">Contact Us</p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => copyToClipboard("+1-212-555-1234")}
                className="flex flex-col cursor-pointer nav-link-2 w-fit">
                <div className="flex items-center gap-2">
                  <div className="flex-center">
                    <ion-icon name="call" />
                  </div>

                  <p>Phone / Fax</p>
                </div>

                <p>+1-212-555-1234</p>
                {notification && (
                  <p className="absolute z-10 mt-12 bg-[#F2F2F2] px-4 py-2 rounded-md text-[#F96D00]">
                    {notification}
                  </p>
                )}
              </button>

              <Link href="mailto:davana1402@gmail.com" className="flex flex-col nav-link-2 w-fit">
                <div className="flex items-center gap-2">
                  <div className="flex-center">
                    <ion-icon name="mail" />
                  </div>

                  <p>Email</p>
                </div>

                <p>official.tripnest@gmail.com</p>
              </Link>

              <Link
                href="https://maps.app.goo.gl/MsA37ufZLFk8gsCY8"
                target="_blank"
                className="flex flex-col nav-link-2 w-fit">
                <div className="flex items-center gap-2">
                  <div className="flex-center">
                    <ion-icon name="location" />
                  </div>

                  <p>Address</p>
                </div>

                <p>
                  Kompleks Perkantoran Harmoni Blok B No. 5, Kec. Harmoni, Jakarta Pusat, DKI
                  Jakarta, 10710
                </p>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-8 mt-4 md:mt-0">
            <div className="flex flex-col items-center gap-2 lg:items-start lg:ml-8">
              <p className="foot-menu">Useful Links</p>

              <div className="flex flex-col items-center gap-2 md:items-start">
                {usefulLinks.map((link) => (
                  <Link
                    href={link.url}
                    key={link.id}
                    className="flex items-center gap-2 text-lg lg:text-base nav-link-2">
                    <ion-icon name={link.icon} className="hidden md:block" />

                    <p>{link.name}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 lg:items-start lg:ml-8">
              <p className="foot-menu">Find Us</p>

              <div className="grid items-center grid-cols-6 gap-4 md:grid-cols-3">
                {socialLinks.map((link) => (
                  <Link
                    href={link.url}
                    key={link.id}
                    target="_blank"
                    className="gap-2 text-2xl flex-center icon-link">
                    <ion-icon name={link.icon} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <p className="md:col-span-3 lg:col-span-4 lg:mt-4 text-center opacity-50 pt-2 border-t-2 border-[#F2F2F2] border-opacity-50">
            Copyright &copy; {year} TripNest
          </p>
        </footer>
      </div>
    </>
  );
}
