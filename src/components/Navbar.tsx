'use client';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMemo, useState } from 'react';

const Navbar = () => {
  const { publicKey } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const walletAddress = useMemo(() => {
    return publicKey ? publicKey.toBase58() : null;
  }, [publicKey]);

  return (
    <nav className="fixed w-full top-0 px-4 md:px-6 py-4 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex justify-between items-center shadow-md z-20">
      <div className="flex items-center">
        <button 
          className="md:hidden mr-4"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] md:bg-transparent p-4 md:p-0`}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <Link href="/" className="hover:text-blue-400 transition-colors duration-200">
              Головна
            </Link>
            <Link href="/edit" className="hover:text-blue-400 transition-colors duration-200">
              Редагувати
            </Link>
            {walletAddress && (
              <Link
                href={`/profile/${walletAddress}`}
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Профіль
              </Link>
            )}
          </div>
        </div>
      </div>
      <div>
        <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-white" />
      </div>
    </nav>
  );
};

export default Navbar;