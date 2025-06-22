// File: src/layouts/sidebar_layout.jsx

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './SidebarLayout.css';
import {
  FaTachometerAlt,
  FaBox,
  FaWarehouse,
  FaFileAlt,
  FaUsers,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';



const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // same as login code


  const navItems = [
    { to: '/products', icon: <FaBox />, label: 'Products' },
    { to: '/orders', icon: <FaFileAlt />, label: 'Orders' },
    { to: '/account', icon: <FaUsers />, label: 'Account' }, // 👈 Add this
  ];



  // New logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // important to send cookies
      });

      if (res.ok) {
        // handle successful logout, e.g. update auth context and redirect
        setUser(null);
        navigate('/', { replace: true });
      } else {
        const errorData = await res.json();
        console.error('Logout failed:', errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  return (
    <div className="d-flex min-vh-100 position-relative">

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="btn btn-dark d-md-none position-absolute m-2"
        style={{ zIndex: 1060 }}
        onClick={() => setMobileSidebarVisible(!mobileSidebarVisible)}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar bg-dark text-white d-flex flex-column
        ${collapsed ? 'collapsed' : ''}
        ${mobileSidebarVisible ? 'show' : ''}`}
      >
        {/* Collapse toggle for desktop */}
        <div className="d-none d-md-flex justify-content-center align-items-center py-3 border-bottom">
          <FaBars
            className="text-white"
            size={20}
            onClick={() => setCollapsed(!collapsed)}
            style={{ cursor: 'pointer' }}
            title="Toggle Sidebar"
          />
        </div>

        <ul className="nav flex-column gap-2 mt-4 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className={`nav-link d-flex align-items-center ${location.pathname === item.to ? 'active' : 'text-white'
                  }`}
                onClick={() => setMobileSidebarVisible(false)} // Hide on mobile tap
              >
                <span className="me-2 d-flex justify-content-center" style={{ minWidth: '24px' }}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto p-3">
          <button
            onClick={handleLogout}
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <FaSignOutAlt style={{ fontSize: collapsed ? '1.5rem' : '1rem' }} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;

