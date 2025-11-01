# Admin Portal

Modern React admin dashboard for E-Learning platform management.

## Features

- 📊 **Dashboard** - Overview with statistics and charts
- 📚 **Courses Management** - CRUD operations for courses
- 📁 **Categories Management** - Organize content with categories
- 🎨 **Modern UI** - Beautiful interface with dark mode support
- 🔐 **JWT Authentication** - Secure admin access
- 📱 **Responsive Design** - Works on all devices

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and update if needed:
```bash
cp .env.example .env
```

The default API URL is `http://localhost:5180` (WebApi.Admin default port).

3. Run development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5175`

## Login

To access the admin portal:

1. First, get a JWT token from the main API:
   - POST to `http://localhost:7135/api/Auth/login` with credentials
   - Or use admin credentials from DbSeeder: `admin@elearn.com` / `Admin@123456`

2. When the login page appears, click "Login with Token" and paste your JWT token

3. You'll be redirected to the dashboard

## Project Structure

```
Frontend/AdminPortal/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   └── layout/
│   │       └── AdminLayout.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Courses.tsx
│   │   └── Categories.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── adminService.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## API Endpoints Used

The portal connects to WebApi.Admin (`http://localhost:5180`):

- `GET /api/admin/AdminCourse` - List courses
- `GET /api/admin/AdminCourse/{id}` - Get course details
- `POST /api/admin/AdminCourse` - Create course
- `PUT /api/admin/AdminCourse/{id}` - Update course
- `DELETE /api/admin/AdminCourse/{id}` - Delete course
- `POST /api/admin/AdminCourse/{id}/restore` - Restore course

- `GET /api/admin/AdminCategory` - List categories
- `GET /api/admin/AdminCategory/{id}` - Get category details
- `POST /api/admin/AdminCategory` - Create category
- `PUT /api/admin/AdminCategory/{id}` - Update category
- `DELETE /api/admin/AdminCategory/{id}` - Delete category

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Charts and graphs
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide Icons** - Icon library
- **Vite** - Build tool

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- All admin routes require JWT authentication
- Token is stored in localStorage
- Token must have Admin or SystemSuperAdmin role
- API calls automatically include Authorization header
