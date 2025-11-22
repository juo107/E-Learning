import { useEffect, useState, useRef } from 'react';
import {
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  X,
  Filter,
  Loader2,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  Mail,
  MailCheck,
} from 'lucide-react';
import {
  userService,
  UserListDto,
  UserDetailsDto,
  UpdateUserDto,
  ResetPasswordDto,
} from '../services/adminService';
import { showToast } from '../components/ui/Toast';

export default function Users() {
  const [users, setUsers] = useState<UserListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const filterSectionRef = useRef<HTMLDivElement>(null);
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetailsDto | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<string | null>(null);
  const pageSize = 10;

  // Filters
  const [filters, setFilters] = useState({
    role: '',
    userType: '',
    emailConfirmed: '',
    isLocked: '',
    sortBy: 'createdAt',
    isDescending: true,
  });

  // Form state
  const [editFormData, setEditFormData] = useState<UpdateUserDto>({
    fullName: '',
    avatarUrl: '',
    role: '',
    emailConfirmed: undefined,
    lockoutEnabled: undefined,
  });

  const [resetPasswordData, setResetPasswordData] = useState<ResetPasswordDto>({
    newPassword: '',
    confirmPassword: '',
  });

  // Debounce filter changes
  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    setIsFiltering(true);
    filterTimeoutRef.current = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [page, searchTerm, filters]);

  // Scroll to filter section when filters change
  useEffect(() => {
    if (users.length > 0 && filterSectionRef.current) {
      filterSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [filters, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setIsFiltering(true);
    try {
      const params: any = {
        pageNumber: page,
        pageSize,
        keyword: searchTerm || undefined,
        sortBy: filters.sortBy,
        isDescending: filters.isDescending,
      };

      if (filters.role) params.role = filters.role;
      if (filters.userType) params.userType = filters.userType;
      if (filters.emailConfirmed !== '') {
        params.emailConfirmed = filters.emailConfirmed === 'confirmed';
      }
      if (filters.isLocked !== '') {
        params.isLocked = filters.isLocked === 'locked';
      }

      const response = await userService.getAll(params);
      const data = response.data?.data || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await userService.update(selectedUser.id, editFormData);
      setShowEditModal(false);
      setSelectedUser(null);
      showToast('User updated successfully!', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to update user:', error);
      showToast(error.response?.data?.message || 'Failed to update user', 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await userService.delete(userToDelete);
      showToast('User deleted successfully!', 'success');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      showToast(error.response?.data?.message || 'Failed to delete user', 'error');
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await userService.getById(id);
      const data = response.data?.data || response.data;
      setSelectedUser(data);
      setShowDetailsModal(true);
    } catch (error: any) {
      console.error('Failed to fetch user details:', error);
      showToast('Failed to fetch user details', 'error');
    }
  };

  const handleEditClick = async (id: string) => {
    try {
      const response = await userService.getById(id);
      const data = response.data?.data || response.data;
      setSelectedUser(data);
      setEditFormData({
        fullName: data.fullName || '',
        avatarUrl: data.avatarUrl || '',
        role: data.role || '',
        emailConfirmed: data.emailConfirmed,
        lockoutEnabled: data.lockoutEnabled,
      });
      setShowEditModal(true);
    } catch (error: any) {
      console.error('Failed to fetch user details:', error);
      showToast('Failed to fetch user details', 'error');
    }
  };

  const handleLock = async (id: string) => {
    try {
      await userService.lock(id);
      showToast('User locked successfully!', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to lock user:', error);
      showToast(error.response?.data?.message || 'Failed to lock user', 'error');
    }
  };

  const handleUnlock = async (id: string) => {
    try {
      await userService.unlock(id);
      showToast('User unlocked successfully!', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to unlock user:', error);
      showToast(error.response?.data?.message || 'Failed to unlock user', 'error');
    }
  };

  const handleResetPasswordClick = (id: string) => {
    setUserToResetPassword(id);
    setResetPasswordData({ newPassword: '', confirmPassword: '' });
    setShowResetPasswordModal(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToResetPassword) return;
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      await userService.resetPassword(userToResetPassword, resetPasswordData);
      showToast('Password reset successfully!', 'success');
      setShowResetPasswordModal(false);
      setUserToResetPassword(null);
      setResetPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Failed to reset password:', error);
      showToast(error.response?.data?.message || 'Failed to reset password', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'systemsuperadmin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'instructor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'student':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all users in the system</p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Note: System Super Admin users are excluded from this list</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div ref={filterSectionRef} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Instructor">Instructor</option>
                <option value="Student">Student</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                User Type
              </label>
              <select
                value={filters.userType}
                onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Status
              </label>
              <select
                value={filters.emailConfirmed}
                onChange={(e) => setFilters({ ...filters, emailConfirmed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="unconfirmed">Unconfirmed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lock Status
              </label>
              <select
                value={filters.isLocked}
                onChange={(e) => setFilters({ ...filters, isLocked: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                <option value="locked">Locked</option>
                <option value="unlocked">Unlocked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="createdAt">Created Date</option>
                <option value="email">Email</option>
                <option value="fullName">Full Name</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order
              </label>
              <select
                value={filters.isDescending ? 'desc' : 'asc'}
                onChange={(e) => setFilters({ ...filters, isDescending: e.target.value === 'desc' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div ref={tableRef} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative">
        {isFiltering && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Filtering users...</p>
            </div>
          </div>
        )}

        {loading && !isFiltering ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatarUrl ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.avatarUrl}
                              alt={user.fullName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                {user.fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.fullName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {user.emailConfirmed ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <MailCheck className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                            <Mail className="w-3 h-3" />
                            Unverified
                          </span>
                        )}
                        {user.lockoutEnabled && user.lockoutEnd && new Date(user.lockoutEnd) > new Date() ? (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                            <Lock className="w-3 h-3" />
                            Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <Unlock className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>Total: {user.totalEnrollments}</div>
                      <div className="text-xs">Completed: {user.completedCourses}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(user.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.lockoutEnabled && user.lockoutEnd && new Date(user.lockoutEnd) > new Date() ? (
                          <button
                            onClick={() => handleUnlock(user.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Unlock"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLock(user.id)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                            title="Lock"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleResetPasswordClick(user.id)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {page}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={users.length < pageSize}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit User</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={editFormData.avatarUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editFormData.emailConfirmed ?? false}
                    onChange={(e) => setEditFormData({ ...editFormData, emailConfirmed: e.target.checked })}
                    className="rounded border-gray-300 dark:border-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Email Confirmed</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editFormData.lockoutEnabled ?? false}
                    onChange={(e) => setEditFormData({ ...editFormData, lockoutEnabled: e.target.checked })}
                    className="rounded border-gray-300 dark:border-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Lockout Enabled</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.fullName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    User Type
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.userType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Confirmed
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.emailConfirmed ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lock Status
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.lockoutEnabled && selectedUser.lockoutEnd && new Date(selectedUser.lockoutEnd) > new Date()
                      ? 'Locked'
                      : 'Active'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Enrollments
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.totalEnrollments}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Completed Courses
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.completedCourses}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    In Progress Courses
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.inProgressCourses}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete User</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
              <button
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setUserToResetPassword(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setUserToResetPassword(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

