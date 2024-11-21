import { useState } from "react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-8 ml-16 transition-all duration-300 bg-gray-100">
        <h1 className="mb-4 text-3xl font-bold">Admin Dashboard</h1>
        <p>Welcome to the admin dashboard. Here you can manage your application.</p>
        {/* Add dashboard content here */}
      </div>
    </div>
  );
}
