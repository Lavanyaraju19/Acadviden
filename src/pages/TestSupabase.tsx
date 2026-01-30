import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function TestSupabase() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from('courses').select('*')
      if (error) console.error('Supabase error:', error)
      else setCourses(data)
    }
    fetchCourses()
  }, [])

  return (
    <div>
      <h1>Supabase Test</h1>
      {courses.map((c: any) => (
        <div key={c.id}>{c.title}</div>
      ))}
    </div>
  )
}
