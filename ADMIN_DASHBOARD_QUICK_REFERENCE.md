# Admin Dashboard - Quick Reference

## 🔗 Access URL
```
/admin/management
```

## 📋 Tables & Operations

| Table | Create | Read | Update | Delete | Filters |
|-------|--------|------|--------|--------|---------|
| Courses | ✅ | ✅ | ✅ | ✅ | Status (active/inactive/archived) |
| Modules | ✅ | ✅ | ✅ | ✅ | None |
| Videos | ✅ | ✅ | ✅ | ✅ | None |
| Assignments | ✅ | ✅ | ✅ | ✅ | None |
| Quizzes | ✅ | ✅ | ✅ | ✅ | None |
| Students | ✅ | ✅ | ✅ | ✅ | Role (student/admin/instructor) |
| Certificates | ✅ | ✅ | ✅ | ✅ | Status (pending/issued/revoked) |
| Payments | ✅ | ✅ | ✅ | ✅ | Status (completed/pending/failed) |
| Job Board | ✅ | ✅ | ✅ | ✅ | Status (active/closed/archived) |

## 📊 Statistics Displayed

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  Total Students │  Total Courses  │ Completed Module│  Total Payments │
│      👥         │       📚        │      🏆         │       💰        │
│     Count       │     Count       │     Count       │     Sum($)      │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

## 🔍 Search & Filter

### Search
- Type in search box
- Searches across ALL columns
- Real-time filtering
- Case-insensitive
- Combine with filters for refined results

### Filter
- Dropdown select (if applicable for table)
- Predefined values based on table
- "All" option resets filter
- Works with search

## 🛠️ How Each Operation Works

### CREATE
```
Click "New [Table]" → Fill Form → Click Create → Confirmation → Table Refreshes
```

### READ
```
Automatic on page load → View all records → Sorted by created_at DESC → Max 100 records
```

### UPDATE
```
Click Edit Button → Form Pre-fills → Modify → Click Update → Confirmation → Table Refreshes
```

### DELETE
```
Click Delete Button → Confirmation Modal → Click Delete → Confirmation → Table Refreshes
```

## 🎯 Form Field Types

| Field Type | Input | Example |
|-----------|-------|---------|
| `*_id` | Text | `123e4567-e89b-12d3-a456-426614174000` |
| `title` | Text | "Web Development 101" |
| `description` | Textarea | "Learn HTML, CSS, JavaScript..." |
| `amount` | Number | "9999" (in cents) |
| `duration` | Number | "3600" (in seconds) |
| `order` | Number | "1" |
| `status` | Select Dropdown | "active" / "pending" / "issued" |
| `created_at` / `date` | Date | YYYY-MM-DD |
| `email` | Text | "user@example.com" |
| `name` | Text | "John Doe" |
| `url` | Text | "https://example.com" |
| `is_completed` | Text | "true" / "false" |

## 📱 Responsive Behavior

| Screen | Layout | Behavior |
|--------|--------|----------|
| Mobile | 1 Column | Single column table, stacked controls |
| Tablet | 2 Columns | Table with partial sidebar |
| Desktop | 3 Columns | Full table + sidebar |

### Mobile Scrolling
- Table scrolls horizontally
- Controls stack vertically
- Modal fills screen
- Touch-friendly button sizes

## 🎨 Color Scheme

```
Primary:    Blue (active tabs, buttons, highlights)
Destructive: Red (delete buttons, warnings)
Success:    Green (completed status)
Warning:    Yellow (pending status)
Info:       Blue (submitted status)
Muted:      Gray (secondary text, disabled)
```

## ⌨️ Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Navigate between fields |
| Enter | Submit form |
| Escape | Close modal |
| Ctrl+F | Browser search (in table) |

## 🚨 Error Handling

| Error | Message | Solution |
|-------|---------|----------|
| No data found | "No data found" | Check table in Supabase |
| Missing field | "Please fill in required fields" | Complete form before submitting |
| DB error | "Operation failed" | Check console for details |
| Not admin | Auto-redirect to /student | Log in as admin |

## 🔐 Security Features

```
✅ Admin Role Check
   └─ useEffect validates userProfile.role === "admin"
   └─ Non-admins auto-redirect to /student

✅ Protected Route
   └─ <ProtectedRoute requiredRole="admin">

✅ Auth Integration
   └─ Supabase authenticated client
   └─ User session required

✅ Data Isolation
   └─ RLS policies (must configure in Supabase)
   └─ User ID scoping available
```

## ⚙️ Configuration

### Increase Record Limit
```tsx
// Find in AdminManagement.tsx, line ~130
.limit(100)  // Change to desired number
```

### Add New Table
```tsx
// 1. Add to TabType union
type TabType = "... | newTable"

// 2. Add to tabs array
{ id: "newTable", label: "New Table", icon: <Icon /> }

// 3. Update helper functions
getTableName(), getColumns(), getFilterKey(), getFilterOptions()
```

### Add Form Validation
```tsx
// In handleFormSubmit()
if (!formData.email || !formData.email.includes('@')) {
  alert("Invalid email");
  return;
}
```

## 📈 Performance Tips

1. **Batch Operations** - Implement bulk update/delete for multiple records
2. **Pagination** - Add page numbers for tables > 100 records
3. **Caching** - Cache stats to reduce API calls
4. **Virtual Scrolling** - For tables with 1000+ rows
5. **Debounce Search** - Add delay to search input for large datasets

## 🐛 Common Issues & Fixes

### Issue: "No data found" always shows
```
✓ Check Supabase table exists
✓ Check RLS policies allow SELECT
✓ Check auth user has admin role
✓ Check browser console for errors
```

### Issue: Modal doesn't close after submit
```
✓ Ensure form validation passes
✓ Check Supabase error logs
✓ Verify table schema matches form
✓ Check network tab for failed requests
```

### Issue: Search is slow
```
✓ Reduce record limit
✓ Add pagination
✓ Implement debouncing
✓ Use native database search instead
```

### Issue: Filters not working
```
✓ Verify column exists in table
✓ Check option values match database
✓ Ensure filter is relevant to table
✓ Reset filter and try again
```

## 📞 Support

For detailed information, see:
- `ADMIN_MANAGEMENT_GUIDE.md` - Complete technical guide
- `ADMIN_DASHBOARD_SUMMARY.md` - Feature overview
- Component code: `src/pages/admin/AdminManagement.tsx`

## 🔄 Data Flow Diagram

```
Page Load
    ↓
Fetch Stats (Parallel)
    ↓
Render UI + Controls
    ↓
[User Action]
    ↓
┌─────────┬──────────┬─────────┐
│ Search  │ Filter   │ CRUD    │
└────┬────┴────┬─────┴────┬────┘
     │         │          │
   Filter   Combine    Modal
   Memory   Results     Form
     │         │          │
     └────┬────┴────┬─────┘
          ↓
      Submit to
      Supabase
          ↓
     Get Response
          ↓
    Refresh Data
          ↓
    Update Table
          ↓
    Close Modal
          ↓
   User Sees
   Updated List
```

## 📊 Database Schema Summary

Each table needs:
- `id` (UUID primary key)
- `created_at` (timestamp)
- `status`/`role` field (if filterable)
- Other custom fields per table

See `ADMIN_MANAGEMENT_GUIDE.md` for complete schema.

---

**Last Updated:** January 26, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
