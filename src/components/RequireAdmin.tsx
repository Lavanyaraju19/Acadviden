import { ReactNode, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user || data.user.role !== 'admin') {
        navigate('/') // redirect non-admins
      } else {
        setLoading(false)
      }
    })
  }, [])

  if (loading) return <div>Checking admin access...</div>
  return <>{children}</>
}
