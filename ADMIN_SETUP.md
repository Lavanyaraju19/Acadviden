# Admin Dashboard - Environment Variables & Setup Guide

## Overview
This document provides setup instructions for the Admin Dashboard in the AcadVizen Digital Hub platform.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Settings (Optional)
VITE_ADMIN_DASHBOARD_ENABLED=true
VITE_ADMIN_TIMEOUT_MINUTES=30
```

## Features

### Admin Dashboard Components

1. **AdminLogin.tsx** - Secure admin login page
   - Email and password authentication via Supabase
   - Admin role verification
   - Error handling and toast notifications

2. **AdminDashboard.tsx** - Main dashboard overview
   - Statistics cards (Students, Courses, Assignments, Certificates)
   - Quick action buttons
   - System information display
   - Responsive design for all devices

3. **AdminSidebar.tsx** - Navigation sidebar
   - Mobile-responsive menu
   - Dropdown user menu
   - Logout functionality
   - Links to all admin sections

4. **AdminTable.tsx** - Reusable data table component
   - Search and filter functionality
   - Pagination support
   - CRUD action buttons
   - Sortable columns
   - Delete confirmation dialog

5. **Admin Sections**:
   - **AdminCoursesManagement.tsx** - Manage courses
   - **AdminModules.tsx** - Manage course modules
   - **AdminStudents.tsx** - Manage student accounts
   - **AdminAssignments.tsx** - Manage assignments
   - **AdminJobs.tsx** - Post and manage job listings
   - **AdminCertificates.tsx** - Issue certificates

## Database Tables Required

Ensure the following tables exist in your Supabase database:

### admin_users
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### courses
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  students INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### modules
```sql
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  course_id UUID REFERENCES courses(id),
  description TEXT,
  order INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student',
  status VARCHAR(50) DEFAULT 'active',
  enrollment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### assignments
```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  module_id UUID REFERENCES modules(id),
  description TEXT,
  due_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### jobs
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### certificates
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  certificate_number VARCHAR(100) UNIQUE,
  issued_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Routes

Add these routes to your React Router configuration:

```tsx
// Admin Routes
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/courses" element={<AdminCoursesManagement />} />
<Route path="/admin/modules" element={<AdminModules />} />
<Route path="/admin/students" element={<AdminStudentsPage />} />
<Route path="/admin/assignments" element={<AdminAssignments />} />
<Route path="/admin/jobs" element={<AdminJobsPage />} />
<Route path="/admin/certificates" element={<AdminCertificatesPage />} />
```

## Security Considerations

1. **Admin Role Verification**: Login page checks for admin_users table entry
2. **Row Level Security (RLS)**: Configure Supabase RLS policies for admin tables
3. **Protected Routes**: Implement route guards using authentication context
4. **Session Management**: Admin sessions have a configurable timeout

## Usage Examples

### Adding a New Admin User

1. Create a user in Supabase Auth
2. Insert a record in admin_users table with admin role
3. User can now access the admin dashboard

### Creating a Course

1. Navigate to /admin/courses
2. Click "Add New" button
3. Fill in course details (Title, Description, Instructor, Status)
4. Click "Create" button
5. Course appears in the table

### Managing Students

1. Go to /admin/students
2. View all enrolled students
3. Add new students with email and name
4. Edit student status (Active/Inactive/Suspended)
5. Delete student records if needed

## Styling

The admin dashboard uses:
- **Tailwind CSS** for styling
- **shadcn/ui** components for consistency
- **Lucide icons** for UI icons
- Responsive design for mobile, tablet, and desktop

## Customization

### Changing Admin Features

Edit the navigation items in AdminSidebar.tsx:

```tsx
const menuItems = [
  // Add or remove items here
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  // ...
];
```

### Modifying Table Columns

Update the columns array in each admin section:

```tsx
const columns: TableColumn[] = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status", render: (val) => <Badge>{val}</Badge> },
];
```

## Troubleshooting

### Login Issues
- Check that the user exists in auth.users
- Verify admin_users record exists for the user
- Check Supabase RLS policies

### Data Not Loading
- Verify database tables exist
- Check Supabase connection string
- Enable appropriate RLS policies

### UI Not Displaying
- Ensure shadcn/ui components are installed
- Check Tailwind CSS configuration
- Verify all imports are correct

## Support

For issues or questions:
1. Check Supabase documentation
2. Review error messages in browser console
3. Verify environment variables
4. Test database connectivity

## Future Enhancements

- [ ] Bulk import students from CSV
- [ ] Email notifications for admins
- [ ] Advanced analytics dashboard
- [ ] Audit logging for all admin actions
- [ ] Role-based access control (RBAC)
- [ ] Automated backup functionality
- [ ] Integration with payment systems
- [ ] Student progress tracking charts
