import { useState, useEffect } from "react";
import API from "../services/api";
import AppShell from "../components/layout/AppShell";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Field, TextInput, SelectInput } from "../components/ui/Field";
import { Plus, Pencil, Trash2, AlertCircle, UserRound } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: "", role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", role: "user" });
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await API.put(`/admin/users/${editingUser.id}`, formData);
      } else {
        await API.post("/admin/users", formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save user");
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <AppShell title="Admin Dashboard" subtitle="Employee Focus Management" variant="admin">
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" />
        </div>
      </AppShell>
    );
  }

  const roleTone = (role: string) =>
    role === "admin" ? "danger" : role === "manager" ? "warning" : "primary";

  return (
    <AppShell title="Admin Dashboard" subtitle="Employee Focus Management" variant="admin">
      {error && (
        <div className="mb-6 flex items-center gap-2.5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#EF4444]">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500">{users.length} registered users</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus size={16} />}>
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_0_rgb(15_23_42_/_0.04),0_1px_6px_-2px_rgb(15_23_42_/_0.06)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-6 py-3.5 text-left font-semibold text-slate-500">Name</th>
              <th className="px-6 py-3.5 text-left font-semibold text-slate-500">Email</th>
              <th className="px-6 py-3.5 text-left font-semibold text-slate-500">Role</th>
              <th className="px-6 py-3.5 text-left font-semibold text-slate-500">Created</th>
              <th className="px-6 py-3.5 text-left font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <UserRound size={15} />
                    </div>
                    <span className="font-medium text-slate-700">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <Badge tone={roleTone(user.role)}>
                    {user.role === 'admin' ? "Admin" : user.role === 'manager' ? "Manager" : "User"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#2563EB]"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-[#EF4444]"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? "Edit User" : "Create User"}
        footer={
          <>
            <Button onClick={handleSubmit} className="flex-1">
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </>
        }
      >
        <Field label="Name">
          <TextInput
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Field>

        <Field label="Email">
          <TextInput
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </Field>

        <Field
          label="Password"
          hint={editingUser ? "(leave empty to keep current)" : undefined}
        >
          <TextInput
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </Field>

        <Field label="Role">
          <SelectInput
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </SelectInput>
        </Field>
      </Modal>
    </AppShell>
  );
}
