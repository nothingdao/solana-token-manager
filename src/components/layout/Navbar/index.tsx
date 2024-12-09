// src/components/layout/Navbar/index.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletConnection } from './components/WalletConnection';
import { StyleSwitcher } from './components/StyleSwitcher';
import { Home, Wallet, Shield } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const primaryNavItems = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/tokens', label: 'Tokens', icon: <Wallet className="w-4 h-4" /> },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar bg-base-200 px-4 border-b border-base-300">
      <div className="container mx-auto">
        <div className="flex-1 flex items-center gap-4">
          {primaryNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 hover:text-primary transition-colors
                ${isActiveRoute(item.path) ? 'text-primary' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex-none flex items-center gap-4">
          <StyleSwitcher />
          <WalletConnection />
        </div>
      </div>
    </nav>
  );
};
