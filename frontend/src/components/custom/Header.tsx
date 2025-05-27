import React, { useState } from 'react';
import { Menu, User, Settings, LogOut, CreditCard, Building2, BarChart3, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [memberName, setMemberName] = useState(user.member_name || user.name);
  const [gender, setGender] = useState(user.gender || '');
  const [degreeProgram, setDegreeProgram] = useState(user.degree_program || '');
  const [isLoading, setIsLoading] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const openDialog = () => {
    setIsDialogOpen(true);
    setIsProfileOpen(false);
    // Reset form to current user data
    setMemberName(user.name);
    setGender(user.gender || '');
    setDegreeProgram(user.degree_program || '');
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/members/${user.id}/fees/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_name: memberName,
          gender: gender,
          degree_program: degreeProgram
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Profile updated successfully!');
        // Update user object if you have a way to do so
        // This depends on your app's state management
        closeDialog();
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 shadow-lg border-b border-purple-700/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4 pl-4 sm:pl-0">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-2.5 shadow-lg ring-2 ring-purple-300/30">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                    Batis
                  </h1>
                  <p className="text-xs text-purple-200/80 hidden sm:block">Budget Audit Tracking Information System</p>
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4 pr-4 sm:pr-0">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 text-purple-200 hover:text-white hover:bg-purple-700/50 rounded-lg transition-all duration-200 backdrop-blur-sm border border-purple-600/30 hover:border-purple-500/50"
                >
                  <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-1.5 shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{memberName}</span>
                  <ChevronDown
                    className="h-4 w-4 transition-transform"
                    style={{
                      transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-purple-200/50 py-1 z-50 ring-1 ring-black/5">
                    <div className="px-4 py-3 border-b border-purple-100/50 bg-gradient-to-r from-purple-50 to-pink-50">
                      <p className="text-sm font-semibold text-gray-900">{memberName}</p>
                      <p className="text-xs text-purple-600/80">{user.email}</p>
                      {user.degree_program && (
                        <p className="text-xs text-gray-500">{user.degree_program}</p>
                      )}
                    </div>
                    <a
                      href="#"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-150"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </a>
                    <button
                      onClick={openDialog}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-150 w-full text-left"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Edit profile</span>
                    </button>
                    <hr className="my-1 border-purple-100/50" />
                    <button
                      onClick={onLogout}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 rounded-b-xl w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-purple-200 hover:text-white hover:bg-purple-700/50 rounded-lg transition-all duration-200 backdrop-blur-sm border border-purple-600/30 hover:border-purple-500/50"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-purple-800/95 to-indigo-800/95 backdrop-blur-md border-t border-purple-600/50">
            <div className="px-4 py-3 space-y-1">
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2.5 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium shadow-md"
              >
                <CreditCard className="h-5 w-5" />
                <span>My Fees</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2.5 text-purple-100 hover:bg-purple-700/50 hover:text-white rounded-lg transition-all duration-150"
              >
                <Building2 className="h-5 w-5" />
                <span>Organizations</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2.5 text-purple-100 hover:bg-purple-700/50 hover:text-white rounded-lg transition-all duration-150"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </a>
              <hr className="my-2 border-purple-600/50" />
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2.5 text-purple-100 hover:bg-purple-700/50 hover:text-white rounded-lg transition-all duration-150"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </a>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  openDialog();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-3 py-2.5 text-purple-100 hover:bg-purple-700/50 hover:text-white rounded-lg transition-all duration-150 w-full text-left"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-3 px-3 py-2.5 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-150 w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Edit Profile Dialog - Positioned at center of screen */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={closeDialog}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="member_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="member_name"
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="degree_program" className="block text-sm font-medium text-gray-700 mb-2">
                  Degree Program
                </label>
                <input
                  id="degree_program"
                  type="text"
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g., Computer Science, Business Administration"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2.5 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;