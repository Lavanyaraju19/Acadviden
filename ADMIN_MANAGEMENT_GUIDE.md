# Admin Management Dashboard - Complete Guide

## Overview
A comprehensive admin dashboard for managing all platform data with full CRUD operations, search, filtering, and statistics. Accessed only by users with admin role.

## Access
- **Route:** `/admin/management`
- **Required Role:** `admin` (enforced by `<ProtectedRoute requiredRole="admin">`)
- **Navigation:** Add link to admin sidebar pointing to `/admin/management`

## Features

### 1. **Statistics Dashboard** 📊
Displays 4 key metrics at the top:
- **Total Students** - Count of all students from `students` table
- **Total Courses** - Count of all courses from `courses` table
- **Completed Modules** - Count of modules where `is_completed = true`
- **Total Payments** - Sum of all payment amounts from `payments` table

Stats load automatically on page mount and include visual icons and color coding.

### 2. **Multi-Table Management** 📋
9 data tables with full CRUD operations:

#### **Courses**
- Columns: `id`, `title`, `description`, `status`, `created_at`
- Filter by: `status` (active, inactive, archived)
- Operations: Create, Read, Update, Delete

#### **Modules**
- Columns: `id`, `title`, `course_id`, `order`, `is_completed`
- Filter: None (all records shown)
- Operations: Create, Read, Update, Delete

#### **Videos**
- Columns: `id`, `title`, `url`, `duration`, `module_id`
- Filter: None
- Operations: Create, Read, Update, Delete

#### **Assignments**
- Columns: `id`, `title`, `module_id`, `due_date`
- Filter: None
- Operations: Create, Read, Update, Delete

#### **Quizzes**
- Columns: `id`, `title`, `module_id`
- Filter: None
- Operations: Create, Read, Update, Delete

#### **Students**
- Columns: `id`, `name`, `email`, `role`
- Filter by: `role` (student, admin, instructor)
- Operations: Create, Read, Update, Delete

#### **Certificates**
- Columns: `id`, `title`, `student_id`, `status`, `issued_at`
- Filter by: `status` (pending, issued, revoked)
- Operations: Create, Read, Update, Delete

#### **Payments**
- Columns: `id`, `student_id`, `amount`, `status`, `date`
- Filter by: `status` (completed, pending, failed)
- Operations: Create, Read, Update, Delete

#### **Job Board**
- Columns: `id`, `title`, `company`, `status`, `posted_at`
- Filter by: `status` (active, closed, archived)
- Operations: Create, Read, Update, Delete

### 3. **Search Functionality** 🔍
- Global search across all columns
- Real-time filtering as user types
- Case-insensitive search
- Works with all data types

### 4. **Filter Functionality** 🎯
- Tab-specific filters based on table
- Dropdown select with predefined options
- Combines with search for refined results
- "All" option to reset filter

### 5. **CRUD Operations** ⚙️

#### **Create**
- "New [Record]" button opens modal form
- Form fields auto-generated from table columns
- Required field validation
- Success notification on creation
- Auto-refresh table data

#### **Read**
- Table displays all records with pagination (100 limit)
- Alternating row colors for readability
- Clickable edit button for each row
- Date formatting for date columns
- Currency formatting for amount columns
- Status badges for status columns

#### **Update**
- Edit button opens pre-populated modal
- All fields editable
- Submit button updates Supabase
- Success notification
- Table auto-refreshes

#### **Delete**
- Delete button opens confirmation modal
- Shows warning message
- Destructive button styling
- Removes record from table on success
- Table auto-refreshes

### 6. **User Interface** 🎨

#### **Tab Navigation**
- 9 tabs for different data tables
- Tab icons for visual identification
- Active tab highlighted in primary color
- Click to switch tables
- Resets search and filter on tab change

#### **Control Bar**
- Search input with magnifying glass icon
- Filter dropdown (when applicable)
- Create button with plus icon
- Responsive layout (stacks on mobile)

#### **Data Table**
- Bordered rows with hover effects
- Column headers with clear labels
- Sortable columns (by created_at descending)
- Responsive horizontal scroll on mobile
- Action buttons (Edit, Delete) per row
- Loading skeletons during fetch
- Empty state message when no data

#### **Modal Dialog**
- Header with operation type
- Dynamic form fields based on table
- Special handling for:
  - Textarea for description fields
  - Select dropdown for status fields
  - Date input for date fields
  - Number input for numeric fields
  - Text input for string fields
- Cancel/Submit buttons
- Confirmation for delete operations

### 7. **Data Formatting** 🎁
- **Dates:** Displayed as localized date string (e.g., "2/26/2026")
- **Amounts:** Formatted as currency with $ symbol (e.g., "$99.99")
- **Status:** Displayed as colored badge
- **Text:** Truncated at 50 characters with ellipsis
- **Booleans:** Displayed as "Yes"/"No" or true/false

## Database Tables Required

All tables should exist in Supabase with the following structure:

### courses
```sql
id UUID PRIMARY KEY
title VARCHAR
description TEXT
status VARCHAR (active, inactive, archived)
created_at TIMESTAMP
```

### modules
```sql
id UUID PRIMARY KEY
course_id UUID REFERENCES courses(id)
title VARCHAR
order INTEGER
is_completed BOOLEAN
```

### videos
```sql
id UUID PRIMARY KEY
module_id UUID REFERENCES modules(id)
title VARCHAR
url VARCHAR
duration INTEGER
created_at TIMESTAMP
```

### assignments
```sql
id UUID PRIMARY KEY
module_id UUID REFERENCES modules(id)
title VARCHAR
due_date TIMESTAMP
created_at TIMESTAMP
```

### quizzes
```sql
id UUID PRIMARY KEY
module_id UUID REFERENCES modules(id)
title VARCHAR
questions JSONB
created_at TIMESTAMP
```

### students
```sql
id UUID PRIMARY KEY
name VARCHAR
email VARCHAR
role VARCHAR
created_at TIMESTAMP
```

### certificates
```sql
id UUID PRIMARY KEY
title VARCHAR
student_id UUID REFERENCES students(id)
status VARCHAR (pending, issued, revoked)
issued_at TIMESTAMP
created_at TIMESTAMP
```

### payments
```sql
id UUID PRIMARY KEY
student_id UUID REFERENCES students(id)
amount NUMERIC (in cents)
status VARCHAR (completed, pending, failed)
date TIMESTAMP
created_at TIMESTAMP
```

### job_board
```sql
id UUID PRIMARY KEY
title VARCHAR
company VARCHAR
status VARCHAR (active, closed, archived)
posted_at TIMESTAMP
created_at TIMESTAMP
```

## Technical Implementation

### Component Structure
```tsx
AdminManagement
├── Stats Display (StatCard x4)
├── Tab Navigation
├── Control Bar (Search + Filter + Create)
├── Data Table
│   ├── Headers
│   ├── Rows (with Edit/Delete buttons)
│   └── Empty State
├── Modal Dialog
│   ├── Create Form
│   ├── Edit Form
│   └── Delete Confirmation
└── Loading/Error States
```

### State Management
```tsx
// Table state
const [activeTab, setActiveTab] = useState<TabType>()
const [tableData, setTableData] = useState<TableRow[]>()
const [filteredData, setFilteredData] = useState<TableRow[]>()

// Modal state
const [showModal, setShowModal] = useState(false)
const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">()
const [selectedRow, setSelectedRow] = useState<TableRow | null>()
const [formData, setFormData] = useState<Record<string, any>>()

// Search/Filter
const [searchTerm, setSearchTerm] = useState("")
const [filterValue, setFilterValue] = useState("")
```

### Data Flow
1. Page loads → Fetch stats in parallel
2. Tab change → Fetch new table data (100 limit, sorted by created_at DESC)
3. Search/Filter change → Filter in-memory data
4. Action button → Open modal with context
5. Form submit → Insert/Update/Delete in Supabase
6. Success → Auto-refresh table data

### Security
- Admin role check via `<ProtectedRoute requiredRole="admin">`
- All operations use Supabase authenticated client
- User ID from auth context available if needed
- Data isolation through Supabase RLS policies (must be configured)

## Key Functions

### `getTableName(tab: TabType): string`
Maps tab ID to Supabase table name

### `getColumns(tab: TabType): string[]`
Returns columns to display for tab

### `getFilterKey(tab: TabType): string`
Returns column name for filtering

### `getFilterOptions(tab: TabType): string[]`
Returns available filter values

### `handleCreate()`
Opens modal for new record

### `handleEdit(row: TableRow)`
Opens modal with row data for editing

### `handleDelete(row: TableRow)`
Opens confirmation modal for deletion

### `handleFormSubmit()`
Validates and submits form to Supabase

## Styling

Uses Tailwind CSS with custom theme:
- Primary colors for active elements
- Muted backgrounds for secondary UI
- Badge components for status
- Skeleton loaders for loading state
- Hover effects on interactive elements
- Responsive grid and flex layouts

## Performance Considerations

1. **Data Fetching:** Limits to 100 records per table (configurable)
2. **Search:** In-memory filtering for fast response
3. **Rendering:** Conditional rendering for modals/skeletons
4. **Sorting:** Data sorted by created_at DESC at fetch time
5. **Parallel Stats:** All stats fetched in parallel with Promise.all

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for all screen sizes
- Touch-friendly button sizes
- Keyboard navigation support

## Future Enhancements

1. Add pagination (currently 100 limit)
2. Implement bulk operations (select multiple, delete all)
3. Add export to CSV/Excel
4. Add column visibility toggle
5. Add sortable columns
6. Add cell-level edit (inline editing)
7. Add data validation with error display
8. Add audit logs for all changes
9. Add batch import from CSV
10. Add advanced search/filters with saved views

## Troubleshooting

### "No data found" message
- Check that table exists in Supabase
- Verify RLS policies allow admin access
- Check browser console for error messages

### Modal not closing
- Ensure form submission succeeds
- Check Supabase error logs
- Verify table schema matches form fields

### Filters not working
- Verify filter column exists in table
- Check that option values match database values
- Refresh page if filter state gets stuck

### Stats showing 0
- Verify tables are populated with data
- Check that auth user has admin role
- Verify RLS policies allow data access
