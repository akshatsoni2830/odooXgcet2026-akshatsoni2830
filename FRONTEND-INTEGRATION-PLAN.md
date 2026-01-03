# FRONTEND INTEGRATION PLAN

## PART 1: FRONTEND REPO ANALYSIS

### Tech Stack
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.11.0
- **Styling:** Tailwind CSS 3.4.19
- **Icons:** Lucide React 0.562.0
- **HTTP Client:** **MISSING** (needs axios)

### Key Differences from Current Implementation
| Aspect | Current | New Frontend | Impact |
|--------|---------|--------------|--------|
| Auth Storage | localStorage (token) | localStorage (full user object) | **CRITICAL** - Must adapt |
| Auth Method | JWT token | Mock login (no API) | **CRITICAL** - Must wire to backend |
| HTTP Client | Axios | None | **CRITICAL** - Must add axios |
| Layout | Navbar + Layout | Sidebar + Layout | UI change only |
| Routing | Simple paths | Nested admin paths | Compatible |
| Role Check | user.role === 'ADMIN' | isAdmin() function | Compatible |

### Routing Structure
```
/signin → SignIn (public)
/signup → SignUp (public) **NOT NEEDED**
/dashboard → EmployeeDashboard (employee)
/admin/dashboard → AdminDashboard (admin)
/attendance → AttendanceTracker (employee)
/leave/request → LeaveRequest (employee)
/leave/approvals → LeaveApprovals (admin)
/profile → ProfileView (employee)
/profile/edit → ProfileEdit (employee)
/payroll → PayrollView (employee)
/admin/employees → EmployeeManagement (admin)
/admin/employees/:id → EmployeeDetails (admin)
/admin/attendance → AttendanceManagement (admin)
/admin/payroll → PayrollManagement (admin)
/admin/settings → Settings (admin) **NOT NEEDED**
```

### Reusable Components (Direct Use)
- ✅ `components/ui/Button.jsx` - Generic button component
- ✅ `components/ui/Card.jsx` - Card wrapper
- ✅ `components/ui/FormInput.jsx` - Form input with label
- ✅ `components/ui/StatusBadge.jsx` - Status badges
- ✅ `components/layout/Sidebar.jsx` - Sidebar navigation
- ⚠️ `components/layout/Layout.jsx` - Needs minor adaptation
- ⚠️ `components/layout/Navbar.jsx` - May not be needed (has Sidebar)

### Components Requiring Adaptation
- ❌ `context/AuthContext.jsx` - **CRITICAL** - Mock auth, must wire to backend API
- ❌ `pages/auth/SignIn.jsx` - Uses employeeId instead of email
- ❌ `pages/auth/SignUp.jsx` - **NOT NEEDED** - Remove (no self-registration)
- ⚠️ All page components - Need API integration with axios

---

## PART 2: API CONTRACT MAPPING

### Authentication Mismatch

| New Frontend Expects | Backend Provides | Adaptation Required |
|---------------------|------------------|---------------------|
| `employeeId` + `password` | `email` + `password` | Change SignIn form to use email |
| Mock login (no API) | `POST /api/auth/login` | Wire AuthContext to backend |
| Store full user object | Store JWT token | Change to token-based auth |
| `user.role` (employee/admin) | `user.role` (EMPLOYEE/ADMIN) | Case conversion |

### API Endpoint Mapping

| Frontend Page | Backend Endpoint | Method | Role | Adaptation |
|--------------|------------------|--------|------|------------|
| **SignIn** | `/api/auth/login` | POST | None | Wire to backend, change employeeId→email |
| **EmployeeDashboard** | `/api/attendance/daily`, `/api/leave/my-requests`, `/api/payroll/my-payroll` | GET | EMPLOYEE | Add axios calls |
| **AdminDashboard** | `/api/employees`, `/api/leave/pending` | GET | ADMIN | Add axios calls |
| **AttendanceTracker** | `/api/attendance/checkin`, `/api/attendance/checkout`, `/api/attendance/daily`, `/api/attendance/weekly` | POST/GET | EMPLOYEE | Add axios calls |
| **LeaveRequest** | `/api/leave/request`, `/api/leave/my-requests` | POST/GET | EMPLOYEE | Add axios calls |
| **LeaveApprovals** | `/api/leave/pending`, `/api/leave/all`, `/api/leave/:id/approve`, `/api/leave/:id/reject` | GET/PUT | ADMIN | Add axios calls |
| **ProfileView** | `/api/employees/:id` | GET | EMPLOYEE | Add axios calls |
| **ProfileEdit** | `/api/employees/:id` | PUT | EMPLOYEE | Add axios calls |
| **PayrollView** | `/api/payroll/my-payroll` | GET | EMPLOYEE | Add axios calls |
| **EmployeeManagement** | `/api/employees` | GET/DELETE | ADMIN | Add axios calls |
| **EmployeeDetails** | `/api/employees/:id` | GET/PUT | ADMIN | Add axios calls |
| **AttendanceManagement** | `/api/attendance/user/:id` | GET | ADMIN | Add axios calls |
| **PayrollManagement** | `/api/payroll` | GET/POST/PUT/DELETE | ADMIN | Add axios calls |

### Data Shape Mapping

**Backend User Object:**
```json
{
  "id": "uuid",
  "email": "admin@dayflow.com",
  "role": "ADMIN"
}
```

**Frontend Expects:**
```json
{
  "id": "uuid",
  "email": "admin@dayflow.com",
  "name": "Admin User",
  "role": "admin",
  "department": "HR",
  "position": "Manager"
}
```

**Adaptation:** Fetch employee profile after login to get full user data.

---

## PART 3: FRONTEND INTEGRATION PLAN

### Phase 1: Setup & Dependencies (10 min)

#### Step 1.1: Install axios
**Files:** `package.json`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:** Add axios dependency  
**Commit:** `chore: add axios for API integration`

#### Step 1.2: Copy UI components
**Files:** Copy from `temp-frontend/src/components/ui/` to `frontend/src/components/ui/`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:** Copy Button, Card, FormInput, StatusBadge components  
**Commit:** `feat: add reusable UI components from new design`

#### Step 1.3: Copy Sidebar component
**Files:** Copy `temp-frontend/src/components/layout/Sidebar.jsx` to `frontend/src/components/layout/`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:** Copy Sidebar component  
**Commit:** `feat: add sidebar navigation component`

---

### Phase 2: Auth Integration (20 min)

#### Step 2.1: Update AuthContext
**Files:** `frontend/src/context/AuthContext.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Keep existing JWT token-based auth
- Add axios interceptor for Authorization header
- Add isAdmin() helper function
- Fetch employee profile after login
- Map role: ADMIN→admin, EMPLOYEE→employee for UI compatibility  
**Commit:** `refactor: enhance AuthContext with profile fetching and role helpers`

#### Step 2.2: Update SignIn page
**Files:** `frontend/src/pages/LoginPage.jsx` → rename to `SignIn.jsx`, move to `pages/auth/`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Use new UI components (FormInput, Button)
- Keep email/password (not employeeId)
- Wire to backend `/api/auth/login`
- Remove quick login buttons (or keep for demo)  
**Commit:** `refactor: update sign-in page with new UI components`

#### Step 2.3: Remove SignUp page
**Files:** Delete `temp-frontend/src/pages/auth/SignUp.jsx` (don't copy)  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:** Don't copy SignUp - not needed (no self-registration)  
**Commit:** N/A

---

### Phase 3: Layout Update (15 min)

#### Step 3.1: Update Layout component
**Files:** `frontend/src/components/Layout.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Replace Navbar with Sidebar
- Add collapsed state management
- Keep authentication check  
**Commit:** `refactor: replace navbar with sidebar layout`

#### Step 3.2: Update App.jsx routing
**Files:** `frontend/src/App.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Update routes to match new structure
- Add /admin/* routes
- Remove /signup route
- Keep ProtectedRoute logic  
**Commit:** `refactor: update routing structure for new UI`

---

### Phase 4: Dashboard Pages (20 min)

#### Step 4.1: Replace Employee Dashboard
**Files:** `frontend/src/pages/Dashboard.jsx` → `pages/dashboard/EmployeeDashboard.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy new EmployeeDashboard structure
- Wire to backend APIs (attendance, leave, payroll)
- Replace mock data with axios calls
- Keep stats from current implementation  
**Commit:** `feat: update employee dashboard with new UI and API integration`

#### Step 4.2: Create Admin Dashboard
**Files:** Create `frontend/src/pages/dashboard/AdminDashboard.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy AdminDashboard from temp-frontend
- Wire to backend APIs (employees count, pending leaves)
- Replace mock data with axios calls  
**Commit:** `feat: add admin dashboard with statistics`

---

### Phase 5: Feature Pages (30 min)

#### Step 5.1: Update Attendance Page
**Files:** `frontend/src/pages/AttendancePage.jsx` → `pages/attendance/AttendanceTracker.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar21@gmail.com>  
**Action:**
- Copy new UI structure
- Keep existing API calls (already correct)
- Update to use new UI components  
**Commit:** `refactor: update attendance page with new UI components`

#### Step 5.2: Update Leave Pages
**Files:** 
- `frontend/src/pages/LeavePage.jsx` → `pages/leave/LeaveRequest.jsx`
- `frontend/src/pages/AdminLeavePage.jsx` → `pages/leave/LeaveApprovals.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy new UI structure
- Keep existing API calls
- Update to use new UI components  
**Commit:** `refactor: update leave management pages with new UI`

#### Step 5.3: Update Payroll Pages
**Files:**
- `frontend/src/pages/PayrollPage.jsx` → `pages/payroll/PayrollView.jsx`
- `frontend/src/pages/AdminPayrollPage.jsx` → `pages/admin/PayrollManagement.jsx`
- `frontend/src/pages/PayrollForm.jsx` → integrate into PayrollManagement  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy new UI structure
- Keep existing API calls
- Update to use new UI components  
**Commit:** `refactor: update payroll pages with new UI`

#### Step 5.4: Update Profile Pages
**Files:**
- `frontend/src/pages/EmployeeProfile.jsx` → split into `pages/profile/ProfileView.jsx` and `pages/profile/ProfileEdit.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy new UI structure
- Keep existing API calls
- Split view/edit into separate pages  
**Commit:** `refactor: split profile into view and edit pages`

---

### Phase 6: Admin Pages (25 min)

#### Step 6.1: Update Employee Management
**Files:**
- `frontend/src/pages/EmployeeList.jsx` → `pages/admin/EmployeeManagement.jsx`
- `frontend/src/pages/EmployeeForm.jsx` → integrate into EmployeeManagement or EmployeeDetails  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy new UI structure
- Keep existing API calls
- Update to use new UI components  
**Commit:** `refactor: update employee management with new UI`

#### Step 6.2: Create Employee Details Page
**Files:** Create `frontend/src/pages/admin/EmployeeDetails.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy from temp-frontend
- Wire to `/api/employees/:id`
- Add edit functionality  
**Commit:** `feat: add employee details page`

#### Step 6.3: Create Admin Attendance Page
**Files:** Create `frontend/src/pages/admin/AttendanceManagement.jsx`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy from temp-frontend
- Wire to `/api/attendance/user/:id`
- Show all employee attendance  
**Commit:** `feat: add admin attendance management page`

---

### Phase 7: Styling & Polish (15 min)

#### Step 7.1: Update CSS
**Files:** `frontend/src/index.css`, `frontend/src/App.css`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy styles from temp-frontend
- Ensure Tailwind classes work
- Add sidebar styles  
**Commit:** `style: update global styles for new UI`

#### Step 7.2: Update Tailwind Config
**Files:** `frontend/tailwind.config.js`  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Copy config from temp-frontend if needed
- Ensure color scheme matches  
**Commit:** `style: update tailwind configuration`

---

### Phase 8: Testing & Cleanup (10 min)

#### Step 8.1: Remove old files
**Files:** Delete unused old components  
**Branch:** frontend  
**Git Identity:** Manas Bhavsar <manas.bhavsar21@gmail.com>  
**Action:**
- Delete old Navbar.jsx (if not used)
- Delete old page files after migration
- Clean up unused imports  
**Commit:** `chore: remove old unused components`

#### Step 8.2: Final integration test
**Files:** N/A  
**Branch:** main  
**Git Identity:** Akshat Soni <akshutsoni@gmail.com>  
**Action:**
- Merge frontend branch to main
- Test all flows
- Verify API integration  
**Commit:** `merge: integrate new frontend UI`

---

## PART 4: REQUIREMENT & UI COMPLIANCE CHECK

| Requirement | Status | Notes |
|------------|--------|-------|
| **User Roles** |
| Two roles: ADMIN and EMPLOYEE | ✅ Satisfied | New frontend supports both roles |
| ADMIN manages all | ✅ Satisfied | Admin routes protected |
| EMPLOYEE accesses own data | ✅ Satisfied | Role-based routing |
| **Authentication** |
| Secure login | ✅ Satisfied | JWT auth preserved |
| Role-based access | ✅ Satisfied | ProtectedRoute with adminOnly flag |
| No public access | ✅ Satisfied | All routes protected |
| **Employee Management** |
| ADMIN CRUD | ✅ Satisfied | EmployeeManagement + EmployeeDetails |
| EMPLOYEE view/edit own | ✅ Satisfied | ProfileView + ProfileEdit |
| **Attendance** |
| Check-in/out | ✅ Satisfied | AttendanceTracker |
| Daily/weekly views | ✅ Satisfied | View toggle in AttendanceTracker |
| ADMIN view all | ✅ Satisfied | AttendanceManagement (new) |
| **Leave Management** |
| EMPLOYEE apply | ✅ Satisfied | LeaveRequest |
| ADMIN approve/reject | ✅ Satisfied | LeaveApprovals |
| Status visible | ✅ Satisfied | StatusBadge component |
| **Payroll** |
| ADMIN manage | ✅ Satisfied | PayrollManagement |
| EMPLOYEE view own | ✅ Satisfied | PayrollView |
| **UI/UX** |
| Sidebar navigation | ✅ Improved | Better than navbar |
| Role-based menu | ✅ Satisfied | Sidebar adapts to role |
| Modern UI | ✅ Improved | Lucide icons, better cards |
| Responsive | ✅ Satisfied | Tailwind responsive classes |

**Summary:** All requirements satisfied. New UI is an improvement.

---

## PART 5: FINAL SAFETY CHECK

### Critical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Auth token mismatch** | 🔴 HIGH | Keep JWT token in localStorage, fetch profile separately |
| **Role case mismatch** | 🟡 MEDIUM | Map ADMIN→admin, EMPLOYEE→employee in AuthContext |
| **Missing axios** | 🔴 HIGH | Install axios first, configure interceptors |
| **API endpoint mismatch** | 🟡 MEDIUM | Verify all endpoints match backend exactly |
| **Breaking existing auth** | 🔴 HIGH | Test login flow thoroughly after changes |
| **Role leakage** | 🟡 MEDIUM | Verify ProtectedRoute logic preserved |
| **SignUp page confusion** | 🟢 LOW | Don't copy SignUp page, remove from routes |

### Mitigation Strategy

#### 1. Auth Token Handling
```javascript
// In AuthContext.jsx
const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  const { token, user } = response.data;
  
  // Store token
  localStorage.setItem('token', token);
  
  // Fetch full profile
  const profileResponse = await axios.get(`/api/employees/${user.id}`);
  const fullUser = {
    ...user,
    ...profileResponse.data,
    role: user.role.toLowerCase() // ADMIN → admin
  };
  
  setUser(fullUser);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
```

#### 2. Role Mapping
```javascript
// In AuthContext.jsx
const isAdmin = () => {
  return user?.role === 'admin' || user?.role === 'ADMIN';
};
```

#### 3. Axios Configuration
```javascript
// In AuthContext.jsx or separate api.js
axios.defaults.baseURL = 'http://localhost:5000';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 4. Backend Contract Verification
- ✅ All endpoints match backend exactly
- ✅ Request bodies match backend expectations
- ✅ Response handling matches backend format
- ✅ Error handling preserves backend error structure

---

## EXECUTION CHECKLIST

### Pre-Integration
- [ ] Backup current frontend folder
- [ ] Verify backend is running and accessible
- [ ] Test current system works before changes

### During Integration
- [ ] Install axios
- [ ] Copy UI components
- [ ] Update AuthContext (CRITICAL)
- [ ] Update SignIn page
- [ ] Update Layout with Sidebar
- [ ] Update routing in App.jsx
- [ ] Migrate all pages one by one
- [ ] Test each page after migration

### Post-Integration
- [ ] Test login as ADMIN
- [ ] Test login as EMPLOYEE
- [ ] Verify role-based navigation
- [ ] Test all CRUD operations
- [ ] Verify API calls work
- [ ] Check browser console for errors
- [ ] Test logout
- [ ] Clean up old files

---

## ESTIMATED TIME: 2-3 hours

**Critical Path:**
1. Install axios (5 min)
2. Update AuthContext (30 min) - MOST CRITICAL
3. Update SignIn (15 min)
4. Update Layout (15 min)
5. Migrate pages (60 min)
6. Test & fix (30 min)

**Total:** ~2.5 hours for complete integration

---

**INTEGRATION READY. PROCEED WITH CAUTION ON AUTH CHANGES.**
