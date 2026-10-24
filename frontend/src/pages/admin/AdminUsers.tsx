import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { usersApi } from "../../api";
import { Users, Mail, CheckCircle2 } from "lucide-react";

interface OfficerUser {
  id: string;
  full_name: string;
  email: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<OfficerUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await usersApi.listOfficers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar totalComplaints={users.length} />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-resolved text-[11px] font-bold">Personnel Registry</span>
            </div>
            <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">Administrative Directory</h1>
            <p className="text-xs text-muted font-medium">
              Authorized investigators, analysts, and administrative operators with system access.
            </p>
          </div>

          <div className="card overflow-hidden p-0 border border-white/70 shadow-glass">
            <div className="px-6 py-4.5 border-b border-white/60 bg-white/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-sage" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal">Authorized Operators</h3>
              </div>
              <span className="text-xs font-mono font-bold text-muted">{users.length} Active Accounts</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-muted text-xs font-semibold">Loading user accounts...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-white/40 border-b border-white/50">
                    <tr>
                      <th className="table-header">Operator Name</th>
                      <th className="table-header">Email Address</th>
                      <th className="table-header">Security Role</th>
                      <th className="table-header">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {users.map((u) => (
                      <tr key={u.id} className="table-row">
                        <td className="table-cell font-bold text-charcoal flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sage/20 border border-sage/30 text-sage font-bold flex items-center justify-center text-xs shrink-0">
                            {u.full_name[0].toUpperCase()}
                          </div>
                          <span>{u.full_name}</span>
                        </td>
                        <td className="table-cell text-muted font-mono">
                          <span className="flex items-center gap-1.5">
                            <Mail size={12} className="text-sage" /> {u.email}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="badge-investigation uppercase tracking-wider font-bold text-[10px]">
                            Official / Admin
                          </span>
                        </td>
                        <td className="table-cell text-emerald-700 font-bold">
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-600" /> Active
                          </span>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-muted">
                          No administrative accounts registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
