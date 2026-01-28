import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// ✅ Safety check: Ensure keys are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or ANON key not set!");
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TestConnection() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudents() {
      console.log("Fetching students from Supabase...");
      try {
        const { data, error } = await supabase.from("students").select("*");
        if (error) throw error;
        console.log("Supabase students:", data);
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  if (loading) return <p>Loading Supabase data...</p>;
  if (error) return <p style={{ color: "red" }}>Error connecting to Supabase: {error}</p>;

  return (
    <div style={{ color: "white" }}>
      <h2>Supabase Students Table</h2>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.name} - {student.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
