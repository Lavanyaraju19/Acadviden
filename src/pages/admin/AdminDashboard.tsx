import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate initial load
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Students</h2>
          <p className="text-sm text-muted-foreground">
            Manage registered students
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Courses</h2>
          <p className="text-sm text-muted-foreground">
            Create and update courses
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Certificates</h2>
          <p className="text-sm text-muted-foreground">
            Issue student certificates
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
