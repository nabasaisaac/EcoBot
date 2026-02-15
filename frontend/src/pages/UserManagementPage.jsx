import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import DataTable from "../components/DataTable";
import ButtonDropdown from "../components/ButtonDropdown";
import { MoreVertical, UserPlus, Pencil, CheckCircle, XCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const inputFocusClass =
  "border border-gray-300 rounded-lg px-3 py-2 transition-all duration-200 focus:outline-none focus:border-[#17563a] focus:ring-2 focus:ring-[#17563a]/30";

export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [formActive, setFormActive] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = (page = currentPage, limit = itemsPerPage) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    fetch(`${API_URL}/api/users?${params}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Unauthorized"))))
      .then((data) => {
        setUsers(data.users || []);
        setTotalResults(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setCurrentPage(data.page ?? 1);
      })
      .catch(() => {
        setUsers([]);
        setTotalResults(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page, itemsPerPage);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
    fetchUsers(1, limit);
  };

  const openAdd = () => {
    setForm({ email: "", password: "", name: "" });
    setError("");
    setModal("add");
  };

  const openEdit = (user) => {
    setForm({ email: user.email, password: "", name: user.name || "" });
    setFormActive(!!user.active);
    setError("");
    setModal({ type: "edit", user });
  };

  const closeModal = () => setModal(null);

  const saveAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const r = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed to create user");
      fetchUsers(currentPage, itemsPerPage);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const body = { email: form.email, name: form.name, active: formActive };
      if (form.password) body.password = form.password;
      const r = await fetch(`${API_URL}/api/users/${modal.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed to update user");
      fetchUsers(currentPage, itemsPerPage);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user) => {
    try {
      const r = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: !user.active }),
      });
      if (r.ok) fetchUsers(currentPage, itemsPerPage);
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: "email", label: "Email", width: "min-w-[180px]" },
    { key: "name", label: "Name", width: "min-w-[120px]" },
    {
      key: "status",
      label: "Status",
      width: "min-w-[100px]",
      render: (row) => (
        <span
          className={`text-sm font-medium ${row.active ? "text-green-600" : "text-gray-500"}`}
        >
          {row.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      width: "min-w-[140px]",
      render: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleString()
          : "—",
    },
    {
      key: "actions",
      label: "",
      width: "60px",
      sortable: false,
      render: (row) => (
        <ButtonDropdown
          buttonContent={<MoreVertical size={18} className="text-gray-600" />}
          buttonClassName="p-1 rounded hover:bg-gray-100"
          options={[
            {
              label: "Edit",
              icon: Pencil,
              value: "edit",
              onClick: () => openEdit(row),
            },
            ...(row.active
              ? [
                  {
                    label: "Deactivate",
                    icon: XCircle,
                    value: "deactivate",
                    onClick: () => toggleActive(row),
                  },
                ]
              : [
                  {
                    label: "Activate",
                    icon: CheckCircle,
                    value: "activate",
                    onClick: () => toggleActive(row),
                  },
                ]),
          ]}
        />
      ),
    },
  ];

  return (
    <div
      className="relative flex w-full min-h-screen"
      style={{ backgroundColor: "#f0f2f5", fontFamily: "Inter, sans-serif" }}
    >
      <Sidebar variant="manual-control" isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 min-w-0 p-4 mt-16 lg:p-8 lg:mt-0 overflow-hidden">
        <div className="flex flex-col gap-6 min-w-0">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#111827" }}>
                User Management
              </h1>
              <p className="text-base text-gray-600">
                Add, edit, activate or deactivate users.
              </p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold bg-[#17563a] hover:opacity-90"
            >
              <UserPlus size={20} /> Add User
            </button>
          </header>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="min-w-0 overflow-hidden">
          <DataTable
            loading={loading}
            data={users}
            columns={columns}
            visibleColumns={[]}
            sortConfig={{}}
            onSort={() => {}}
            getSortIcon={() => null}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[10, 20, 50]}
            totalResults={totalResults}
            selectedRows={[]}
            onSelectAll={() => {}}
            onSelectRow={() => {}}
            emptyState={
              <div className="py-6 text-center text-gray-500">
                No users yet. Click &quot;Add User&quot; to create one.
              </div>
            }
          />
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {modal === "add" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add User</h2>
            <form onSubmit={saveAdd} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputFocusClass}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Password</span>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputFocusClass}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Name (optional)</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputFocusClass}
                />
              </label>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#17563a] text-white hover:opacity-90 disabled:opacity-50">
                  {saving ? "Saving..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {modal?.type === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={saveEdit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputFocusClass}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputFocusClass}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">New password (leave blank to keep)</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputFocusClass}
                  placeholder="Optional"
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#17563a] text-white hover:opacity-90 disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
