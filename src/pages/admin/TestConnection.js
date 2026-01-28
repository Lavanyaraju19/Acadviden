// src/TestConnection.js
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Read from .env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TestConnection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example: fetch from "students" table
        const { data, error } = await supabase.from('students').select('*');
        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Supabase Connection Test</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestConnection;