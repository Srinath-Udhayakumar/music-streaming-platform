/**
 * Sidebar Navigation Component
 * Main navigation for app sections with role-based menu items
 * Apple Music-inspired design
 */

import { useAuth } from '@/auth/AuthContext';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

interface SidebarSection {
  id: string;
  label: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const sections: SidebarSection[] = [
    { id: 'home', label: 'Listen Now', path: '/', icon: '♫' },
    { id: 'browse', label: 'Browse', path: '/browse', icon: '◉' },
    { id: 'playlists', label: 'My Playlists', path: '/playlists', icon: '𝄞' },
    { id: 'library', label: 'Library', path: '/library', icon: '⚁' },
    // Admin-only sections
    ...(user?.role === 'ADMIN' ? [
      { id: 'upload', label: 'Add Song', path: '/admin/upload', icon: '⬆', adminOnly: true },
      { id: 'manage', label: 'Manage Songs', path: '/admin/manage', icon: '⚙', adminOnly: true },
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <h1 className="sidebar-logo">♪ Music</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-menu">
        <div className="menu-section">
          <p className="section-title">Menu</p>
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  to={section.path}
                  className={`menu-link ${isActive(section.path) ? 'active' : ''} ${section.adminOnly ? 'admin-only' : ''}`}
                  title={section.label}
                >
                  <span className="menu-icon">{section.icon}</span>
                  <span className="menu-label">{section.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Spacer */}
      <div className="sidebar-spacer"></div>

      {/* User Section */}
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="user-email">{user?.email}</p>
            <p className="user-role">
              {user?.role === 'ADMIN' ? '👑 Admin' : '👤 User'}
            </p>
          </div>
        </div>

        <button
          className="user-menu-button"
          onClick={() => setShowUserMenu(!showUserMenu)}
          title="User menu"
          aria-label="User menu"
        >
          ⋮
        </button>

        {showUserMenu && (
          <div className="user-menu-dropdown">
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
