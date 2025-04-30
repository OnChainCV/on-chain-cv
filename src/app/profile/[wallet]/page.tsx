"use client"

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";


const MOCK_NFTS: NFT[] = [
    { id: '1', name: 'NFT Dragon', image: '/nfts/dragon.png' },
    { id: '2', name: 'Crypto Kitty', image: '/nfts/kitty.png' },
    { id: '3', name: 'Pixel Ape', image: '/nfts/ape.png' },
];

export default function ProfilePage() {
    const { wallet } = useParams();
    const [profile, setProfile] = useState<null | {
        nickname: string;
        avatarId: string;
        selectedNFTs: string[];
        frame: string;
        wallet: string;
    }>(null);


    useEffect(() => {
        if (wallet && typeof wallet === 'string') {
            const saved = localStorage.getItem(`profile_${wallet}`);
            if (saved) {
                setProfile(JSON.parse(saved));
            } else {
                setProfile({
                    nickname: 'Web3 User',
                    avatarId: MOCK_NFTS[0].id,
                    selectedNFTs: MOCK_NFTS.map(nft => nft.id),
                    frame: 'none',
                    wallet,
                });
            }
        }
    }, [wallet]);

    if (!profile) {
        return <div className="text-center mt-20 text-gray-500">Завантаження профілю...</div>;
    }

    const avatarNFT = MOCK_NFTS.find(nft => nft.id === profile.avatarId);
    const visibleNFTs = MOCK_NFTS.filter(nft => profile.selectedNFTs.includes(nft.id));

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="text-center mb-8">
                {avatarNFT && (
                    <div
                        className={`inline-block rounded-full overflow-hidden w-40 h-40 mb-4 border-4 ${profile.frame === 'gold'
                                ? 'border-yellow-400'
                                : profile.frame === 'silver'
                                    ? 'border-gray-400'
                                    : profile.frame === 'rainbow'
                                        ? 'border-pink-500 border-dashed'
                                        : 'border-transparent'
                            }`}
                    >
                        <img src={avatarNFT.image} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                )}
                <h1 className="text-3xl font-bold">{profile.nickname || 'Анонім'}</h1>
                <p className="text-sm text-gray-500 mt-1">{profile.wallet}</p>
            </div>

            <h2 className="text-xl font-semibold mb-4">NFT у публічному профілі:</h2>
            <div className="grid grid-cols-3 gap-4">
                {visibleNFTs.map(nft => (
                    <div key={nft.id} className="text-center">
                        <img src={nft.image} alt={nft.name} className="rounded-lg" />
                        <p className="text-sm mt-1">{nft.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}