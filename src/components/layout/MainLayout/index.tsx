// src/components/layout/MainLayout/index.tsx
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { TokenNav } from '../TokenNav';

export const MainLayout = () => {  // Remove Props interface and FC typing
  const { mintId } = useParams();

  return (
    <div className='min-h-screen flex flex-col bg-base-100 text-base-content'>
      <Navbar />
      {mintId && <TokenNav mintId={mintId} />}

      <main className='flex-1 container mx-auto p-4'>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
