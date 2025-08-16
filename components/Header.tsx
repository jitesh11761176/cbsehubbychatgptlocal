
import React, { useState } from 'react';
import { type NavItem } from '../types';
import { MenuIcon, CloseIcon, UserIcon, DashboardIcon, BookOpenIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { View } from '../App';

const baseNavItems: NavItem[] = [
  { name: 'Classes', href: '#' },
  { name: 'Subjects', href: '#' },
  { name: 'Notes', href: '#' },
  { name: 'Syllabus', href: '#' },
  { name: 'Papers', href: '#' },
];

interface HeaderProps {
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = user?.role === 'admin' 
    ? [...baseNavItems, { name: 'Admin Panel', href: '#' }] 
    : baseNavItems;
    
  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.name === 'Admin Panel') {
      e.preventDefault();
      setView('dashboard');
      setIsMenuOpen(false);
    }
    // Handle other nav items if needed
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" onClick={(e) => { e.preventDefault(); setView('home'); }} className="flex-shrink-0 flex items-center gap-2">
              <BookOpenIcon className="h-8 w-8 text-indigo-600"/>
              <span className="text-xl font-bold text-slate-800">CBSE Hub</span>
            </a>
            <nav className="hidden md:ml-10 md:flex md:items-baseline md:space-x-8">
              {navItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={(e) => handleNavClick(e, item)}
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <a href="#" onClick={(e) => { e.preventDefault(); setView('dashboard'); }} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
                  <DashboardIcon className="h-5 w-5 mr-1" />
                  Dashboard
              </a>
            )}
            <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    {user?.photoUrl ? (
                        <img className="h-8 w-8 rounded-full" src={user.photoUrl} alt="User profile" />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ring-1 ring-white">
                            <UserIcon className="h-5 w-5 text-white" />
                        </div>
                    )}
                </button>
            </div>
             <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Logout
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} onClick={(e) => handleNavClick(e, item)} className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                {item.name}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                 {user?.photoUrl ? (
                    <img className="h-10 w-10 rounded-full" src={user.photoUrl} alt="User profile" />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-500" />
                    </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-slate-800">{user?.displayName}</div>
                <div className="text-sm font-medium text-slate-500">{user?.email || user?.phone}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              {(user?.role === 'teacher' || user?.role === 'admin') && (
                <a href="#" onClick={(e) => { e.preventDefault(); setView('dashboard'); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Dashboard</a>
              )}
              <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Logout</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
