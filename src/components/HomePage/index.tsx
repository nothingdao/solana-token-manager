// src/components/HomePage/index.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Token Management</h1>
        <p className="text-lg">
          Create new and manage existing Solana tokens, with full support for spl-token and token-2022 standards.
        </p>
      </section>

      <section className="bg-base-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Get Started</h2>
        <div className="space-y-4">
          <Link to="/tokens" className="btn btn-primary">
            Manage Tokens
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
