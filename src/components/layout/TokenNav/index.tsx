// src/components/layout/TokenNav/index.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface TokenNavProps {
  mintId: string;
}

export const TokenNav: React.FC<TokenNavProps> = ({ mintId }) => {
  const location = useLocation();

  const tokenNavItems = [
    { path: `/tokens/${mintId}`, label: 'Overview' },
    { path: `/tokens/${mintId}/mint`, label: 'Mint' },
    { path: `/tokens/${mintId}/burn`, label: 'Burn' },
    { path: `/tokens/${mintId}/transfer`, label: 'Transfer' },
    { path: `/tokens/${mintId}/accounts`, label: 'Accounts' },
    { path: `/tokens/${mintId}/metadata`, label: 'Metadata' },
    { path: `/tokens/${mintId}/extensions`, label: 'Extensions' },
  ];

  return (
    <nav className="bg-base-200 border-b border-base-300">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 px-4 overflow-x-auto">
          {tokenNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-3 border-b-2 whitespace-nowrap
                ${location.pathname === item.path
                  ? 'border-primary text-primary'
                  : 'border-transparent hover:text-primary'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TokenNav;
