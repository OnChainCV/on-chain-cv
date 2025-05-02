'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, Nft } from '@metaplex-foundation/js';

const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = Metaplex.make(connection);

export default function PublicProfilePage() {
    const params = useParams();
    const wallet = params?.wallet as string | undefined;

    const [nfts, setNfts] = useState<Nft[]>([]);
    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
    const [frame, setFrame] = useState('none');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!wallet || typeof wallet !== 'string') return;

        const fetchNFTs = async () => {
            setLoading(true);
            try {
                const publicKey = new PublicKey(wallet);
                const all = await metaplex.nfts().findAllByOwner({ owner: publicKey });

                const fullNfts = await Promise.all(
                    all
                        .filter((nft) => nft.model === 'metadata')
                        .map(async (nft) => await metaplex.nfts().load({ metadata: nft }))
                );

                const withImages = fullNfts.filter(n => n.json?.image);

                setNfts(withImages);

                // Завантаження локального профілю
                const saved = localStorage.getItem(`profile_${wallet}`);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setAvatarId(parsed.avatarId || withImages[0]?.address.toBase58() || null);
                    setSelectedNFTs(parsed.selectedNFTs || withImages.map(n => n.address.toBase58()));
                    setFrame(parsed.frame || 'none');
                } else {
                    // Якщо даних нема — дефолт
                    setAvatarId(withImages[0]?.address.toBase58() || null);
                    setSelectedNFTs(withImages.map(n => n.address.toBase58()));
                    setFrame('none');
                }
            } catch (e) {
                console.error('Помилка при завантаженні профілю:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [wallet]);

    if (!wallet || typeof wallet !== 'string') return <div className="p-4 text-red-500">Не передано публічний ключ гаманця.</div>;

    if (loading) return <div className="text-center mt-20 text-gray-500">Завантаження профілю...</div>;

    const avatarNft = nfts.find(n => n.address.toBase58() === avatarId) || nfts[0];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Профіль користувача</h1>

            {avatarNft && (
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={avatarNft.json?.image}
                        alt={avatarNft.name}
                        className={`w-40 h-40 object-cover border-4
                             ${frame === 'круг' ? 'rounded-full' : ''}
                             ${frame === 'квадрат' ? 'rounded-none' : ''}
                            ${frame === 'none' ? 'rounded-lg' : ''}
                        `}
                    />
                    <p className="mt-2 text-lg font-medium">{avatarNft.name}</p>
                </div>
            )}

            <h2 className="text-xl font-semibold mb-4 text-center">NFT колекція</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {nfts
                    .filter(nft => selectedNFTs.includes(nft.address.toBase58()))
                    .map(nft => (
                        <div key={nft.address.toBase58()} className="border rounded-lg overflow-hidden">
                            <img src={nft.json?.image} alt={nft.name} className="object-cover w-full h-auto aspect-square" />
                            <p className="text-center p-2 text-sm">{nft.name}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
