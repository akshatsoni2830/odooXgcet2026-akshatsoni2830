# ⚠️ IMPORTANT: Final Setup Steps

## 1. Update Database Password

Edit `backend/.env` and change:
```
DB_PASSWORD=your_password
```
to your actual PostgreSQL password.

## 2. Start Backend Server

```bash
cd backend
npm start
```

Backend will run on: http://localhost:5000

## 3. Start Frontend Server (in a new terminal)

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:3000

## 4. Login Credentials

**Admin:**
- Email: admin@dayflow.com
- Password: password123

**Employee:**
- Email: john.doe@dayflow.com
- Password: password123

## 5. Test the Application

1. Open http://localhost:3000
2. Login with admin credentials
3. Test all features:
   - Employee management
   - Attendance tracking
   - Leave requests
   - Payroll management

## Current Status

✅ Database created and seeded
✅ Backend dependencies installed
✅ Frontend dependencies installed
⚠️ Need to update DB_PASSWORD in backend/.env
⏳ Ready to start servers

## Next Steps

1. Update `backend/.env` with your PostgreSQL password
2. Run `npm start` in backend folder
3. Run `npm run dev` in frontend folder
4. Open http://localhost:3000 and login!
