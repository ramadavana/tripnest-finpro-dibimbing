import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatedRoles, setUpdatedRoles] = useState({}); // Track roles per user

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const jwtToken = getCookie("token");
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId, role) => {
    try {
      const jwtToken = getCookie("token");
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-user-role/${userId}`,
        { role },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert(`User role updated to ${role} successfully!`);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user role");
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phoneNumber && user.phoneNumber.includes(query)) // Periksa jika phoneNumber tidak null
    );
    setFilteredUsers(results);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 ml-16 md:p-8">
      <h1 className="mb-4 text-xl font-bold md:text-2xl">Manage Users</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search user by name, email, or phone"
          className="w-full px-4 py-2 border rounded md:w-1/2"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <table className="text-sm border border-gray-300 w-fit md:text-base">
        <thead>
          <tr>
            <th className="px-2 py-2 border md:px-4">No</th>
            <th className="px-2 py-2 border md:px-4">Name</th>
            <th className="px-2 py-2 border md:px-4">Email</th>
            <th className="px-2 py-2 border md:px-4">Phone</th>
            <th className="px-2 py-2 border md:px-4">Role</th>
            <th className="px-2 py-2 border md:px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id}>
              <td className="px-2 py-2 text-center border md:px-4">{index + 1}</td>
              <td className="px-2 py-2 border md:px-4">{user.name}</td>
              <td className="px-2 py-2 border md:px-4">{user.email}</td>
              <td className="px-2 py-2 border md:px-4">{user.phoneNumber}</td>
              <td className="px-2 py-2 text-center border md:px-4">
                <select
                  className="px-2 py-1 border rounded"
                  value={updatedRoles[user.id] || user.role}
                  onChange={(e) => setUpdatedRoles({ ...updatedRoles, [user.id]: e.target.value })}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="px-2 py-2 text-center border md:px-4">
                <button
                  className="px-2 py-1 text-white bg-blue-500 rounded md:px-3 hover:bg-blue-600"
                  onClick={() => updateUserRole(user.id, updatedRoles[user.id] || user.role)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
