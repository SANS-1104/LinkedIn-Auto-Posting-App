import React, { useEffect, useState } from "react";
import { Button } from "../../LANDING-PAGE/ui/button";
import axiosClient from "../../../api/axiosClient";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/studioAdmin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, updates) => {
    try {
      await axiosClient.put(`/studioAdmin/users/${id}`, updates);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error updating user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosClient.delete(`/studioAdmin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);
  

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Plan</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border">
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                <select
                  value={u.role}
                  onChange={(e) => updateUser(u._id, { role: e.target.value })}
                  className="border p-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </td>
              <td className="p-2 border">{u.subscriptionPlan?.name || "—"}</td>
              <td className="p-2 border">{u.subscriptionStatus}</td>
              <td className="p-2 border">
                <Button
                  variant="destructive"
                  onClick={() => deleteUser(u._id)}
                  className="text-sm text-red-500"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
