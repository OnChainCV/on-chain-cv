'use client';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';

const Navbar = () => {
  const { publicKey } = useWallet();

  const walletAddress = useMemo(() => {
    return publicKey ? publicKey.toBase58() : null;
  }, [publicKey]);

  return (
    <nav className="fixed w-full top-0 px-6 py-4 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex justify-between items-center shadow-md z-20">
      <div className="flex space-x-6 items-center">
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
      <div>
        <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-white" />
      </div>
    </nav>
  );
};

export default Navbar;