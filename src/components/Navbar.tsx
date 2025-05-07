"use client";

import Link from "next/link";
import WalletButton from "@/components/Solana/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Navbar() {
    const { connected } = useWallet();

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">

            <div className="flex items-center gap-2">
                <Link href="/" className="text-2xl font-bold">
                    Web3-resume
                </Link>
            </div>


            <div className="flex items-center gap-6">             

                {connected && (
                    <>
                        <Link href="/edit" className="hover:text-gray-400 transition">
                        Edit profile
                        </Link>
                        <Link href="/my-vibes" className="hover:text-gray-400 transition">
                            My profile
                        </Link>
                    </>
                )}
                <WalletButton />

            </div>
        </nav>
    );
}
