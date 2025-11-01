import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';

export default function AdminLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
		try {
			const raw = localStorage.getItem('admin_sidebar_open');
			return raw ? JSON.parse(raw) : true;
		} catch {
			return true;
		}
	});

	const [mobileOpen, setMobileOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const handleLogout = () => {
		// Clear auth data
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		// Redirect to login
		navigate('/login');
	};

	useEffect(() => {
		try {
			localStorage.setItem('admin_sidebar_open', JSON.stringify(sidebarOpen));
		} catch {}
	}, [sidebarOpen]);

	// Close user menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (userMenuOpen) {
				const target = event.target as Element;
				if (!target.closest('.user-menu-container')) {
					setUserMenuOpen(false);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [userMenuOpen]);

	return (
		<div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-950">
			{/* Desktop Sidebar */}
			<aside
				className={`hidden md:flex fixed inset-y-0 left-0 z-40 h-screen flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-[width] duration-300 ease-in-out will-change-[width] ${sidebarOpen ? 'w-64' : 'w-16'}`}
				aria-label="Admin menu"
			>
				<div className="h-14 flex items-center justify-between px-3">
					<button
						onClick={() => setSidebarOpen((v) => !v)}
						className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
						aria-expanded={sidebarOpen}
						aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${sidebarOpen ? '' : 'rotate-180'}`}>
							<path d="M21 4H3"/><path d="M21 12H8"/><path d="M21 20H3"/>
						</svg>
					</button>
					<span
						className={`text-sm font-medium text-gray-700 dark:text-gray-300 motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
						aria-hidden={!sidebarOpen}
					>
						Admin
					</span>
				</div>
				<nav className="px-2 py-2 space-y-1">
					<Link to="/admin" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${location.pathname === '/admin' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} ${sidebarOpen ? '' : 'justify-center'}`}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2 4 4 8-8 2 2"/></svg>
						<span className={`motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>Overview</span>
					</Link>
					<Link to="/admin/courses" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${location.pathname.startsWith('/admin/courses') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} ${sidebarOpen ? '' : 'justify-center'}`}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M20 22V2H6.5A2.5 2.5 0 0 0 4 4.5V22"/></svg>
						<span className={`motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>Courses</span>
					</Link>
					<Link to="/admin/categories" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${location.pathname.startsWith('/admin/categories') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} ${sidebarOpen ? '' : 'justify-center'}`}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
						<span className={`motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>Categories</span>
					</Link>
					<Link to="/admin/users" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${location.pathname.startsWith('/admin/users') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} ${sidebarOpen ? '' : 'justify-center'}`}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
						<span className={`motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>Users</span>
					</Link>
					<Link to="/admin/orders" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${location.pathname.startsWith('/admin/orders') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} ${sidebarOpen ? '' : 'justify-center'}`}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4-8h5l2 4h7a2 2 0 0 1 2 2z"/><circle cx="10.5" cy="19.5" r="1.5"/><circle cx="17.5" cy="19.5" r="1.5"/></svg>
						<span className={`motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>Orders</span>
					</Link>
					<Link to="/admin/revenue" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${location.pathname.startsWith('/admin/revenue') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} ${sidebarOpen ? '' : 'justify-center'}`}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>
						<span className={`motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>Revenue</span>
					</Link>
					<Link to="/admin/products" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${location.pathname.startsWith('/admin/products') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} ${sidebarOpen ? '' : 'justify-center'}`}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
						<span className={`motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>Products</span>
					</Link>
					<Link to="/admin/system" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${location.pathname.startsWith('/admin/system') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} ${sidebarOpen ? '' : 'justify-center'}`}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v4"/><path d="M12 19v4"/><path d="M4.22 4.22l2.83 2.83"/><path d="M16.95 16.95l2.83 2.83"/><path d="M1 12h4"/><path d="M19 12h4"/><path d="M4.22 19.78l2.83-2.83"/><path d="M16.95 7.05l2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>
						<span className={`motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>System</span>
					</Link>
					<Link to="/admin/settings" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${location.pathname.startsWith('/admin/settings') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} ${sidebarOpen ? '' : 'justify-center'}`}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 5.22l1.42 1.42"/><path d="M18.36 19.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 18.78l1.42-1.42"/><path d="M18.36 4.64l1.42-1.42"/><circle cx="12" cy="12" r="3"/></svg>
						<span className={`motion-safe:transition-opacity motion-safe:duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>Settings</span>
					</Link>
				</nav>
			</aside>

			{/* Mobile Drawer */}
			<div className={`md:hidden fixed inset-0 z-40 ${mobileOpen ? '' : 'pointer-events-none'}`}
				aria-hidden={!mobileOpen}
			>
				{/* Backdrop */}
				<div
					className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
					onClick={() => setMobileOpen(false)}
				/>
				{/* Panel */}
				<aside className={`absolute left-0 top-0 h-full w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
					<div className="h-14 flex items-center justify-between px-3">
						<button
							onClick={() => setMobileOpen(false)}
							className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
							aria-label="Close menu"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M18 6L6 18"/><path d="M6 6l12 12"/>
							</svg>
						</button>
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
					</div>
					<nav className="px-2 py-2 space-y-1">
						<Link to="/admin" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${location.pathname === '/admin' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2 4 4 8-8 2 2"/></svg>
							<span>Overview</span>
						</Link>
						<Link to="/admin/courses" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${location.pathname.startsWith('/admin/courses') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M20 22V2H6.5A2.5 2.5 0 0 0 4 4.5V22"/></svg>
							<span>Courses</span>
						</Link>
						<Link to="/admin/categories" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${location.pathname.startsWith('/admin/categories') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
							<span>Categories</span>
						</Link>
					</nav>
				</aside>
			</div>

			{/* Main */}
			<div className={`flex-1 min-w-0 ${sidebarOpen ? 'md:pl-64' : 'md:pl-16'}`}> 
				{/* Topbar */}
				<div className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80">
					<div className="flex items-center gap-2">
						<button
							onClick={() => setMobileOpen((v) => !v)}
							className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 motion-safe:transition-colors"
							aria-expanded={sidebarOpen}
							aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M21 4H3"/><path d="M21 12H8"/><path d="M21 20H3"/>
							</svg>
						</button>
						<h1 className="text-lg font-semibold">Admin</h1>
					</div>
					{/* User menu */}
					<div className="flex items-center gap-3">
						<button className="h-9 px-3 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm">New</button>
						
						{/* User dropdown */}
						<div className="relative user-menu-container">
							<button
								onClick={() => setUserMenuOpen(!userMenuOpen)}
								className="flex items-center gap-2 h-9 px-3 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm"
							>
								<div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
									<User className="h-3 w-3 text-white" />
								</div>
								<span className="hidden sm:block">Admin</span>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							
							{/* Dropdown menu */}
							{userMenuOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
									<div className="py-1">
										<button
											onClick={() => {
												setUserMenuOpen(false);
												// Navigate to profile if needed
											}}
											className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
										>
											<User className="h-4 w-4" />
											Profile
										</button>
										<button
											onClick={() => {
												setUserMenuOpen(false);
												handleLogout();
											}}
											className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
										>
											<LogOut className="h-4 w-4" />
											Logout
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="p-4">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
