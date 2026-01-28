# Supabase Storage Deployment Checklist

## Pre-Deployment Setup (24-48 hours before launch)

### Supabase Configuration
- [ ] Create account or log in to Supabase project
- [ ] Verify project is on correct environment (prod/staging)
- [ ] Check database backup is configured
- [ ] Enable point-in-time recovery
- [ ] Set up monitoring and alerts

### Storage Buckets
- [ ] Create `course-videos` bucket (500MB max)
- [ ] Create `course-pdfs` bucket (50MB max)
- [ ] Create `student-assignments` bucket (100MB max)
- [ ] Create `certificates` bucket (20MB max)
- [ ] Set all buckets to PUBLIC access
- [ ] Verify CORS settings are correct
- [ ] Test upload to each bucket manually

### Database Tables
- [ ] Create `course_videos` table
- [ ] Create `course_pdfs` table
- [ ] Create `assignment_submissions` table
- [ ] Create `certificates` table
- [ ] Create `file_activity_logs` table (optional)
- [ ] Create all indexes
- [ ] Verify foreign key constraints
- [ ] Test insert/update/delete on each table

### Row Level Security (RLS)
- [ ] Enable RLS on all 4 main tables
- [ ] Create policies for `course_videos`
- [ ] Create policies for `course_pdfs`
- [ ] Create policies for `assignment_submissions`
- [ ] Create policies for `certificates`
- [ ] Test RLS with different user roles
- [ ] Verify students can only see own submissions
- [ ] Verify instructors can see student work
- [ ] Verify admins have full access

### Environment Variables
- [ ] Add `VITE_SUPABASE_URL` to `.env.local`
- [ ] Add `VITE_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Verify environment variables are NOT in git
- [ ] Check `.gitignore` includes `.env*` files
- [ ] Test that app can connect to Supabase

## Code Deployment

### Component Installation
- [ ] Ensure all 4 upload components are in `src/components/`
  - [ ] `FileUpload.tsx`
  - [ ] `AssignmentUpload.tsx`
  - [ ] `CertificateUpload.tsx`
  - [ ] `VideoUpload.tsx`
  - [ ] `PDFUpload.tsx`
- [ ] Verify storage module at `src/integrations/supabase/storage.ts`
- [ ] Check all imports are correct
- [ ] Run TypeScript compiler: `npm run build`
- [ ] Fix any TypeScript errors
- [ ] Run linter: `npm run lint`
- [ ] Fix any linting errors

### Route Configuration
- [ ] Add assignment submission route
- [ ] Add video upload route
- [ ] Add PDF upload route
- [ ] Add certificate issuance route
- [ ] Add student dashboard assignments section
- [ ] Add instructor submission view page
- [ ] Verify all routes are protected (authentication)
- [ ] Test navigation between components

### UI Testing
- [ ] Test file drag-and-drop
- [ ] Test file selection via dialog
- [ ] Test file validation messages
- [ ] Test progress indicators
- [ ] Test error messages
- [ ] Test success messages
- [ ] Test on mobile devices
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test with slow internet (throttle network)

## Functional Testing

### File Upload Tests
- [ ] Upload small file (< 1MB)
- [ ] Upload medium file (5-10MB)
- [ ] Upload large file (near size limit)
- [ ] Upload file that exceeds size limit
- [ ] Upload file with unsupported type
- [ ] Verify file appears in Supabase bucket
- [ ] Verify metadata is saved to database
- [ ] Verify public URL works
- [ ] Verify signed URL works
- [ ] Test multiple concurrent uploads

### Assignment Submission
- [ ] Student can submit assignment before deadline
- [ ] Student cannot re-submit (prevents overwrite)
- [ ] Instructor can see all submissions
- [ ] Student can see their own submission
- [ ] Student cannot see other submissions
- [ ] Assignment shows in student dashboard
- [ ] Submission metadata is saved to database
- [ ] Grade/feedback updates from instructor are visible

### Video Upload & Playback
- [ ] Instructor can upload video
- [ ] Video appears in course module
- [ ] Student can view published video
- [ ] Video plays in HTML5 player
- [ ] Video controls work (play, pause, seek)
- [ ] Video duration displays correctly
- [ ] Video metadata is saved to database
- [ ] Unpublished videos not visible to students

### PDF Upload & Viewing
- [ ] Instructor can upload PDF
- [ ] PDF appears in course materials
- [ ] Student can download PDF
- [ ] PDF preview works in browser
- [ ] Text is searchable in PDF viewer
- [ ] PDF metadata is saved to database
- [ ] Different resource types categorize correctly

### Certificate Issuance
- [ ] Admin can upload certificate file
- [ ] Certificate number auto-generates
- [ ] Certificate number can be customized
- [ ] Student receives certificate (can view)
- [ ] Student can download certificate
- [ ] Student can share certificate
- [ ] Certificate appears in transcript
- [ ] Certificate metadata is saved to database
- [ ] Only student and instructors can access

### Streaming & Performance
- [ ] Large file uploads complete successfully
- [ ] Progress bar updates during upload
- [ ] Downloads complete successfully
- [ ] Slow network doesn't cause timeouts
- [ ] Cancel upload works properly
- [ ] File list loads quickly
- [ ] Database queries are optimized
- [ ] No memory leaks in long sessions

## Security Testing

### Access Control
- [ ] Non-authenticated users cannot access storage
- [ ] Students cannot access admin routes
- [ ] Instructors cannot delete student submissions
- [ ] Students cannot modify their grades
- [ ] File URLs don't expose sensitive data
- [ ] Signed URLs expire correctly
- [ ] Expired URLs return 403/404

### File Validation
- [ ] Malicious file names are sanitized
- [ ] File type validation works server-side
- [ ] File size validation works server-side
- [ ] Zero-byte files are rejected
- [ ] Executables cannot be uploaded
- [ ] No path traversal vulnerabilities

### Data Protection
- [ ] Personal data is not logged unnecessarily
- [ ] Files have appropriate retention policies
- [ ] Old files are deleted per policy
- [ ] Deleted files can be recovered (backup)
- [ ] Database backups are encrypted
- [ ] Transmission uses HTTPS/TLS

## Performance Testing

### Load Testing
- [ ] 10 concurrent uploads
- [ ] 50 concurrent uploads
- [ ] 100+ simultaneous users
- [ ] Database handles query load
- [ ] No timeout errors under load
- [ ] Memory usage stays reasonable

### File Size Testing
- [ ] 100MB file upload
- [ ] 500MB file upload
- [ ] Files near bucket limits
- [ ] Edge case: exactly at limit
- [ ] Cleanup after large files

### Network Conditions
- [ ] 3G speed simulation
- [ ] 4G speed simulation
- [ ] Metered connection
- [ ] High latency (250ms+)
- [ ] Packet loss scenario
- [ ] Resume interrupted uploads

## Documentation

- [ ] API reference created
- [ ] Component usage examples documented
- [ ] Database schema documented
- [ ] Folder structure documented
- [ ] Error handling documented
- [ ] Troubleshooting guide created
- [ ] Setup instructions written
- [ ] Maintenance procedures documented
- [ ] Backup/restore procedures documented

## Monitoring Setup

- [ ] Set up error tracking (Sentry/similar)
- [ ] Configure file upload monitoring
- [ ] Set up database performance monitoring
- [ ] Configure storage quota alerts
- [ ] Create dashboard for metrics
- [ ] Set up log aggregation
- [ ] Configure uptime monitoring
- [ ] Create alerts for failures

## Deployment Day

### Final Checks
- [ ] Code review completed
- [ ] All tests passing
- [ ] No console errors in production build
- [ ] Environment variables configured
- [ ] Database backups taken
- [ ] Rollback plan prepared
- [ ] Team notified of deployment

### Deployment Steps
1. [ ] Deploy code to staging first
2. [ ] Run smoke tests on staging
3. [ ] Get approval from stakeholders
4. [ ] Deploy to production
5. [ ] Monitor error tracking immediately
6. [ ] Check database performance
7. [ ] Verify file uploads work end-to-end
8. [ ] Monitor for 24 hours

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check database query performance
- [ ] Verify file storage is working
- [ ] Monitor user feedback
- [ ] Check logs for any issues
- [ ] Document any issues found
- [ ] Create follow-up tasks if needed

## Troubleshooting Guide

### Upload Fails with "File Too Large"
**Solution:**
1. Check file size against limit (see bucket limits)
2. Verify bucket size limit matches expected
3. Check available storage quota in Supabase
4. Try smaller file
5. Check browser console for detailed error

### "Permission Denied" on File Upload
**Solution:**
1. Verify user is authenticated
2. Check RLS policies allow insert
3. Verify bucket is not set to private
4. Check user role matches policy conditions
5. Test with admin account

### Files Upload but Don't Appear
**Solution:**
1. Check database table has data
2. Verify folder structure is correct
3. Check RLS policies for select access
4. Verify file_path is stored correctly
5. Check timestamps match upload time

### Signed URLs Not Working
**Solution:**
1. Verify expiry time hasn't passed
2. Check URL hasn't been tampered with
3. Verify bucket name is correct
4. Check file path exists in bucket
5. Try getting new signed URL

### PDF Preview Not Working
**Solution:**
1. Verify PDF file is valid and not corrupted
2. Check CORS settings on bucket
3. Try downloading and opening locally
4. Check browser supports PDF viewer
5. Try different browser

### Video Won't Play
**Solution:**
1. Verify video format is supported (MP4/WebM)
2. Check video file is valid
3. Verify browser video codec support
4. Check CORS settings
5. Try different browser
6. Check file size (may need streaming)

### Database Insert Fails
**Solution:**
1. Check all foreign keys exist
2. Verify course_id and module_id are valid
3. Check user_id is valid
4. Verify table structure matches code
5. Check RLS policy allows insert
6. Review database error message

### Out of Storage
**Solution:**
1. Check current usage in Supabase dashboard
2. Delete old/unused files
3. Archive old course materials
4. Implement retention policy
5. Upgrade Supabase plan
6. Compress old files

### Slow Downloads
**Solution:**
1. Check network speed
2. Verify file isn't too large
3. Check CDN cache status
4. Monitor server performance
5. Consider using signed URLs
6. Implement client-side caching

## Rollback Plan

If issues occur:
1. [ ] Identify issue severity
2. [ ] Decide whether to rollback
3. [ ] If rollback needed:
   - [ ] Revert code to previous version
   - [ ] Verify database hasn't been corrupted
   - [ ] Test with sample data
   - [ ] Deploy rollback version
   - [ ] Monitor for issues
4. [ ] Document what went wrong
5. [ ] Schedule post-mortem

## Maintenance Schedule

### Weekly
- [ ] Check error logs
- [ ] Monitor storage usage
- [ ] Verify backups completed

### Monthly
- [ ] Review performance metrics
- [ ] Check for unused files
- [ ] Update documentation
- [ ] Security audit

### Quarterly
- [ ] Capacity planning review
- [ ] Disaster recovery drill
- [ ] Performance optimization review
- [ ] Security audit

## Contact & Support

### Supabase Support
- Documentation: https://supabase.com/docs
- Community: https://discord.supabase.io
- Status: https://status.supabase.com

### Internal Contacts
- Database Admin: [Contact info]
- DevOps Lead: [Contact info]
- Security Officer: [Contact info]

## Sign-Off

- [ ] Development Team Lead
- [ ] QA Lead
- [ ] DevOps Engineer
- [ ] Product Manager
- [ ] Security Officer

**Deployment Date:** _______________

**Deployed By:** _______________

**Approved By:** _______________

