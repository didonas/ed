# 🔧 Supabase "Failed to Fetch" Troubleshooting Guide

## 🚨 Common Causes

The "Failed to fetch" error happens when the application cannot connect to Supabase. Here are the most common causes:

### 1. Supabase Project Paused (Most Common)
Supabase automatically **pauses inactive projects** after 7 days of inactivity.

**Solution:**
1. Go to https://supabase.com/dashboard
2. Log in to your account
3. Find your project: `zbnhjldjlsdfvzezpjfu`
4. If you see "Project Paused" banner → Click **"Restore"** or **"Resume Project"**
5. Wait 1-2 minutes for the project to become active
6. Try logging in again

### 2. Internet Connection Issues
**Solution:**
1. Check your internet connection
2. Try accessing https://zbnhjldjlsdfvzezpjfu.supabase.co in your browser
3. If it doesn't load, your connection might be blocking Supabase

### 3. Firewall/VPN Blocking Supabase
**Solution:**
1. Temporarily disable VPN if you're using one
2. Check firewall settings
3. Try on a different network (mobile hotspot)

### 4. Environment Variables Not Loaded
**Solution:**
1. Stop the dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Environment variables are loaded on server start

### 5. CORS Issues (Browser Security)
**Solution:**
1. Clear browser cache: Ctrl+Shift+Delete
2. Try in incognito mode: Ctrl+Shift+N
3. Try a different browser

---

## ✅ Quick Diagnostic Steps

### Step 1: Check Supabase Project Status
```
1. Go to: https://supabase.com/dashboard
2. Log in
3. Click on your project
4. Check status at top of page
5. If paused → Click "Restore Project"
```

### Step 2: Test Supabase URL
Open this URL in your browser:
```
https://zbnhjldjlsdfvzezpjfu.supabase.co
```

**Expected Result:**
- Should show a Supabase info page or JSON response
- Should NOT show connection error

**If it doesn't load:**
- Your network is blocking Supabase
- Project might be deleted
- URL might be incorrect

### Step 3: Check Environment Variables
```bash
# Stop dev server (Ctrl+C)

# Verify .env.local exists
dir .env.local

# Should show the file

# Restart dev server
npm run dev
```

### Step 4: Test in Browser Console
```javascript
// Open browser console (F12)
// Paste this code:

fetch('https://zbnhjldjlsdfvzezpjfu.supabase.co')
  .then(response => console.log('✅ Supabase reachable:', response.status))
  .catch(error => console.error('❌ Connection failed:', error));
```

---

## 🔍 Detailed Solutions

### Solution 1: Restore Paused Supabase Project

1. **Visit Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Find Your Project:**
   - Project ID: `zbnhjldjlsdfvzezpjfu`
   - Region: (Check your dashboard)

3. **Check Project Status:**
   - Look for "Paused" badge or banner
   - Click "Restore" or "Resume"
   - Wait 1-2 minutes

4. **Verify Project Active:**
   - Status should show "Active" or green indicator
   - Try the admin login again

### Solution 2: Verify Supabase Credentials

**Check .env.local file:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://zbnhjldjlsdfvzezpjfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get Fresh Credentials:**
1. Go to Supabase Dashboard
2. Click your project
3. Go to Settings → API
4. Copy:
   - Project URL
   - anon/public key (NOT service_role key)
5. Update .env.local if different
6. Restart server

### Solution 3: Network/Firewall Issues

**If using VPN:**
```
1. Disconnect VPN
2. Try logging in
3. If it works → VPN is blocking Supabase
4. Configure VPN to allow supabase.co
```

**If using corporate network:**
```
1. Try mobile hotspot
2. If it works → Corporate firewall is blocking
3. Contact IT to whitelist *.supabase.co
```

**Check Firewall (Windows):**
```
1. Windows Security
2. Firewall & network protection
3. Allow an app through firewall
4. Make sure browser has network access
```

### Solution 4: Database/Auth Configuration

**Check Supabase Auth is Enabled:**
```
1. Supabase Dashboard
2. Authentication → Settings
3. Verify "Email" provider is enabled
4. Check "Site URL" is correct
```

**Check Database Tables Exist:**
```
1. Supabase Dashboard
2. Table Editor
3. Verify "enquiries" table exists
4. Verify "notifications" table exists
```

---

## 🧪 Testing the Fix

### Test 1: Connection Test
```bash
# In browser console (F12)
fetch('https://zbnhjldjlsdfvzezpjfu.supabase.co/rest/v1/')
  .then(r => r.json())
  .then(d => console.log('✅ Connected:', d))
  .catch(e => console.error('❌ Failed:', e));
```

### Test 2: Auth Test
```bash
# Try admin login with your credentials
# Should either:
# - Show "Invalid credentials" (connection works)
# - Show "Failed to fetch" (connection broken)
```

### Test 3: Full Flow Test
```
1. Stop dev server (Ctrl+C)
2. Clear .next folder: rm -rf .next
3. Restart: npm run dev
4. Open incognito: Ctrl+Shift+N
5. Go to /admin/login
6. Try logging in
```

---

## 💡 Enhanced Error Messages

I've updated the login page to show more helpful error messages:

**Before:**
```
Failed to fetch
```

**Now:**
```
Network error: Cannot reach authentication server. 
Please check your internet connection.
```

Or:

```
Connection failed. Please check:
1) Your internet connection
2) Supabase project is active
3) Firewall/VPN settings
```

---

## 🔑 Creating Admin User (If Needed)

If you don't have an admin account yet:

### Option 1: Supabase Dashboard
```
1. Go to Supabase Dashboard
2. Authentication → Users
3. Click "Add User"
4. Enter email: maker13x@gmail.com
5. Enter password: (your password)
6. Check "Auto Confirm User"
7. Click "Create User"
```

### Option 2: SQL Editor
```sql
-- In Supabase SQL Editor
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  'maker13x@gmail.com',
  crypt('your-password-here', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

---

## 📋 Checklist

Use this checklist to diagnose the issue:

- [ ] Supabase project is NOT paused (check dashboard)
- [ ] Can access https://zbnhjldjlsdfvzezpjfu.supabase.co in browser
- [ ] .env.local file exists with correct credentials
- [ ] Dev server restarted after env changes
- [ ] No VPN/firewall blocking Supabase
- [ ] Internet connection working
- [ ] Browser cache cleared
- [ ] Tried incognito mode
- [ ] Auth provider enabled in Supabase
- [ ] Admin user exists in Supabase Auth

---

## 🚀 Quick Fix Commands

```bash
# 1. Stop server
Ctrl+C

# 2. Clear build cache
rm -rf .next

# 3. Restart
npm run dev

# 4. Open in incognito
# Chrome: Ctrl+Shift+N
# Firefox: Ctrl+Shift+P
# Edge: Ctrl+Shift+N
```

---

## 🆘 Still Not Working?

### Check These:

1. **Supabase Project Status:**
   - Dashboard shows "Active" (not Paused)
   - No red error banners

2. **Network Test:**
   - Can ping google.com
   - Can access other websites
   - Firewall not blocking

3. **Credentials Test:**
   - URL matches dashboard
   - Anon key matches dashboard
   - No extra spaces in .env.local

4. **Alternative Solution - Use Supabase Studio:**
   ```
   1. Go to Supabase Dashboard
   2. Click your project
   3. Table Editor → enquiries
   4. View/manage data directly
   5. (Bypass admin login temporarily)
   ```

---

## 📞 Support Resources

**Supabase Status:**
https://status.supabase.com/

**Supabase Docs:**
https://supabase.com/docs/guides/auth

**Check Firewall:**
- Windows Firewall settings
- Antivirus settings
- VPN configuration

---

## ✅ Expected Behavior After Fix

When everything is working:

1. **Admin Login Page:**
   - Loads without errors
   - Shows email and password fields
   - No "Failed to fetch" message

2. **After Clicking "Secure Sign In":**
   - Either shows "Invalid credentials" (if wrong password)
   - Or redirects to /admin/dashboard (if correct)
   - Should NOT show "Failed to fetch"

3. **Network Tab (F12):**
   - Should see requests to zbnhjldjlsdfvzezpjfu.supabase.co
   - Status code: 200 or 400 (not network error)
   - No red errors in Console tab

---

## 🎯 Most Likely Fix

**90% of the time, it's this:**

1. Go to https://supabase.com/dashboard
2. Find your project
3. Click "Restore Project" or "Resume"
4. Wait 1-2 minutes
5. Try logging in again

**If that doesn't work:**
Try accessing the site from mobile hotspot to rule out network issues.

---

**Last Updated:** 2026-07-17
**Status:** Diagnostic guide complete
**Next Steps:** Check Supabase dashboard for paused project
