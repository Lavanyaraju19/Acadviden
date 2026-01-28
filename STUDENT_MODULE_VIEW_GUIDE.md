# Student Module View - Implementation Guide

## Overview
The Student Module View is a comprehensive learning page component that displays all content and interactive elements for a single course module. Students can watch video lectures, download materials, submit assignments, and complete quizzes all on one page.

## Route
```
/student/courses/:courseId/modules/:moduleId
```

## Features Implemented

### 1. **Video Lectures** 📹
- Fetches all videos from the `videos` table for the module
- Displays video player with iframe embed
- Shows video title and description
- Video duration display
- Video playlist navigation
- Auto-selects first video on load
- Responsive video player

### 2. **Course Materials** 📚
- Fetches materials from the `materials` table
- Supports multiple file types (PDF, Video, Code)
- Color-coded icons based on file type:
  - 🔴 Red: PDF files
  - 🔵 Blue: Video files
  - 🟡 Yellow: Code/other files
- Download button for each material
- Direct file download functionality

### 3. **Assignments** 📤
- Fetches assignments from the `assignments` table
- Assignment title, description, and due date
- File upload functionality
- Submission status display:
  - Pending (yellow)
  - Submitted (blue)
  - Graded (green)
- Uploads files to Supabase storage: `assignment_submissions` bucket
- Creates submission record in `assignment_submissions` table
- Success/error notifications

### 4. **Quizzes** ❓
- Fetches quizzes from the `quizzes` table with questions
- Multiple choice questions
- Radio button selection for answers
- Question text display
- All questions validation before submission
- Quiz answers stored in `quiz_submissions` table
- Timestamp recording
- Success/error handling

### 5. **Live Sessions** 🔴
- Fetches upcoming sessions from `live_sessions` table
- Shows session title, instructor, and scheduled date/time
- Join session button with external link
- Only displays future sessions
- Right sidebar display for easy access

### 6. **Module Information** ℹ️
- Module title and description
- Status display (Completed/In Progress)
- Module order/number
- Content summary showing counts of:
  - Videos
  - Materials
  - Assignments
  - Quizzes

## Database Tables Required

### modules
```sql
- id (UUID, primary key)
- course_id (UUID, foreign key to courses)
- title (varchar)
- description (text)
- order (integer)
- is_completed (boolean, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

### videos
```sql
- id (UUID, primary key)
- module_id (UUID, foreign key to modules)
- title (varchar)
- url (varchar) -- embed URL for iframe
- duration (integer, optional) -- in seconds
- description (text, optional)
- order (integer, optional)
- created_at (timestamp)
```

### materials
```sql
- id (UUID, primary key)
- module_id (UUID, foreign key to modules)
- title (varchar)
- file_url (varchar)
- file_type (varchar) -- 'pdf', 'video', 'code', etc.
- created_at (timestamp)
```

### quizzes
```sql
- id (UUID, primary key)
- module_id (UUID, foreign key to modules)
- title (varchar)
- description (text, optional)
- questions (jsonb) -- Array of question objects
- created_at (timestamp)
```

### quizzes questions structure (JSONB)
```json
[
  {
    "id": "q1",
    "question_text": "What is React?",
    "options": ["A library", "A framework", "A language", "A tool"],
    "correct_answer": 0
  }
]
```

### assignments
```sql
- id (UUID, primary key)
- module_id (UUID, foreign key to modules)
- title (varchar)
- description (text, optional)
- due_date (timestamp, optional)
- created_at (timestamp)
```

### assignment_submissions
```sql
- id (UUID, primary key)
- assignment_id (UUID, foreign key to assignments)
- student_id (UUID, foreign key to students)
- file_url (varchar) -- storage path
- submitted_at (timestamp)
- graded_at (timestamp, optional)
- feedback (text, optional)
- grade (numeric, optional)
```

### quiz_submissions
```sql
- id (UUID, primary key)
- quiz_id (UUID, foreign key to quizzes)
- student_id (UUID, foreign key to students)
- answers (jsonb) -- { "q1": 0, "q2": 1, ... }
- submitted_at (timestamp)
- score (numeric, optional)
- passed (boolean, optional)
```

### live_sessions
```sql
- id (UUID, primary key)
- module_id (UUID, foreign key to modules)
- title (varchar)
- scheduled_at (timestamp)
- join_url (varchar, optional)
- instructor_name (varchar)
- description (text, optional)
- created_at (timestamp)
```

## Component Usage

### Import
```tsx
import StudentModuleView from "@/pages/student/StudentModuleView";
```

### Route Integration (Already configured in App.tsx)
```tsx
<Route 
  path="/student/courses/:courseId/modules/:moduleId" 
  element={
    <ProtectedRoute>
      <StudentModuleView />
    </ProtectedRoute>
  } 
/>
```

## Key Functionality

### Video Player
- Uses iframe for embedded videos (YouTube, Vimeo, custom players)
- Supports fullscreen mode
- Responsive design

### File Downloads
- Client-side download triggered through blob URL
- Works with any file type stored in Supabase

### Assignment Submission
- File input validation
- Storage upload with unique naming: `{studentId}/{assignmentId}/{timestamp}_{filename}`
- Database record creation for tracking
- User feedback on success/failure

### Quiz Submission
- Validates all questions answered before allowing submission
- Stores answers as JSON object
- Prevents re-answering after submission (can be extended)
- Displays confirmation message

## Responsive Design

- **Mobile**: Single column layout, stacked cards
- **Tablet**: 2-column layout with sidebar
- **Desktop**: 3-column layout (videos, content, sidebar)

### Breakpoints Used
- `lg:col-span-2` - Two-thirds width on desktop
- `hidden lg:block` - Hide on mobile/tablet
- `grid-cols-1 lg:grid-cols-3` - 1 column mobile, 3 columns desktop

## Loading & Error States

### Loading State
- Skeleton loaders for content
- Smooth transition when data loads
- All sections load in parallel

### Error State
- Error message display
- Back button to navigate away
- Console error logging

## Styling

Uses Tailwind CSS with custom theme:
- Primary colors for buttons and highlights
- Muted foreground for secondary text
- Card components for content grouping
- Hover effects for interactivity
- Icon indicators for content types

## Security Considerations

1. **Authentication**: Route protected by `<ProtectedRoute>` component
2. **File Uploads**: Uploaded to Supabase storage with user ID in path
3. **Database Access**: Uses Supabase type-cast to bypass empty type definitions
4. **User Isolation**: Student ID from auth context ensures data isolation

## Performance Optimizations

1. Parallel data fetching using Promise.all
2. Lazy video loading (iframe loads on demand)
3. Skeleton loaders for UX
4. Minimal re-renders with proper state management

## Future Enhancements

1. Add video progress tracking
2. Implement quiz retry logic
3. Add comments/discussion section
4. Assignment grading with feedback display
5. Module completion tracking
6. Progress percentage calculation
7. Time spent on module tracking
8. Certificate generation on completion

## Testing

### Sample Navigation
To test the module view, navigate to:
```
/student/courses/{courseId}/modules/{moduleId}
```

Where:
- `courseId`: Valid course UUID with enrollments
- `moduleId`: Valid module UUID in that course

### Sample Data
Test data should include:
- At least 1 video with valid embed URL
- At least 1 material file
- At least 1 assignment
- At least 1 quiz with questions
- Optional: 1 live session in the future
