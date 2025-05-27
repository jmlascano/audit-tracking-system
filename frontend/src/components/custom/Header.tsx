import React, { useState } from 'react';
import { Menu, User, Settings, LogOut, CreditCard, Building2, BarChart3, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 shadow-lg border-b border-purple-700/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand - Moved to very left edge */}
          <div className="flex items-center space-x-4 pl-4 sm:pl-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-2.5 shadow-lg ring-2 ring-purple-300/30">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                  Batis
                </h1>
                <p className="text-xs text-purple-200/80 hidden sm:block">Organization Fee Management</p>
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
                <span className="hidden sm:block text-sm font-medium">John Doe</span>
                <ChevronDown className="h-4 w-4 transition-transform" style={{
                  transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-purple-200/50 py-1 z-50 ring-1 ring-black/5">
                  <div className="px-4 py-3 border-b border-purple-100/50 bg-gradient-to-r from-purple-50 to-pink-50">
                    <p className="text-sm font-semibold text-gray-900">John Doe</p>
                    <p className="text-xs text-purple-600/80">john.doe@university.edu</p>
                  </div>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-150">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-150">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                  <hr className="my-1 border-purple-100/50" />
                  <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 rounded-b-xl w-full text-left">
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
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium shadow-md">
              <CreditCard className="h-5 w-5" />
              <span>My Fees</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-purple-100 hover:bg-purple-700/50 hover:text-white rounded-lg transition-all duration-150">
              <Building2 className="h-5 w-5" />
              <span>Organizations</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-purple-100 hover:bg-purple-700/50 hover:text-white rounded-lg transition-all duration-150">
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </a>
            <hr className="my-2 border-purple-600/50" />
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-purple-100 hover:bg-purple-700/50 hover:text-white rounded-lg transition-all duration-150">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-purple-100 hover:bg-purple-700/50 hover:text-white rounded-lg transition-all duration-150">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </a>
              <button onClick={onLogout}   className="flex items-center space-x-3 px-3 py-2.5 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-150 cursor-pointer">
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
                </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;