'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, Nft } from '@metaplex-foundation/js';

const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = Metaplex.make(connection);

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export default function PublicProfilePage() {
  const params = useParams();
  const wallet = params?.wallet as string | undefined;

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [frame, setFrame] = useState('none');
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState<number>(0);
  const filteredNfts = nfts.filter(nft => selectedNFTs.includes(nft.address.toBase58()));

  useEffect(() => {
    if (!wallet || typeof wallet !== 'string') return;

    const cookieKey = `view_count_${wallet}`;
    const current = parseInt(getCookie(cookieKey) || '0');
    const updated = current + 1;
    setCookie(cookieKey, String(updated));
    setViewCount(updated);

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

        const withImages = fullNfts.filter((n): n is Nft => n.model === 'nft' && !!n.json?.image);

        setNfts(withImages);

        try {
          const res = await fetch(`/api/profile?wallet=${publicKey.toBase58()}`);
          if (!res.ok) throw new Error('Profile not found');
          const data = await res.json();
          if (data) {
            console.log(data)
            setAvatarId(data.avatarId || withImages[0]?.address.toBase58() || null);
            setSelectedNFTs(data.selectedNFTs);
            setFrame(data.frame || 'none');
          } else {
            setAvatarId(withImages[0]?.address.toBase58() || null);
            setSelectedNFTs(withImages.map(n => n.address.toBase58()));
            setFrame('none');
          }
        } catch (error) {
          console.log('No saved profile or error:', error);
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
  <div className="max-w-5xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row justify-center items-start pt-20">
    <div className="w-full md:w-2/3">
      <div className="w-full md:w-1/3 md:pr-8 max-h-[500px] overflow-y-auto mb-6 md:mb-0">
        <h2 className="text-xl font-semibold mb-4 text-left">Timeline get NFT</h2>
        {/* <DevelopmentLine nfts={nfts} selectedNFTs={selectedNFTs} /> */}
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Профіль користувача</h1>

      {avatarNft && (
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <img
            src={avatarNft.json?.image}
            alt={avatarNft.name}
            className={`w-32 h-32 sm:w-40 sm:h-40 object-contain border-4
                        ${frame === 'круг' ? 'rounded-full' : ''}
                        ${frame === 'квадрат' ? 'rounded-none' : ''}
                        ${frame === 'none' ? 'rounded-lg' : ''}
                      `}
          />
          <p className="mt-2 text-base sm:text-lg font-medium">{avatarNft.name}</p>
        </div>
      )}

      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">NFT колекція</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredNfts.map((nft) => (
          <div
            key={nft.address.toBase58()}
            className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >            
            <img
              src={nft.json?.image}
              alt={nft.name}
              className="w-full h-48 sm:h-48 object-contain bg-gray-100 p-2"
            />            
            
            <div className="md:absolute inset-0 bg-black bg-opacity-60 md:opacity-0 group-hover:md:opacity-100 transition duration-300 flex items-center justify-center p-4">
              <div className="text-white text-xs sm:text-sm text-left space-y-2">
                <h3 className="text-base sm:text-lg font-semibold">{nft.name}</h3>
                {nft.json?.symbol && (
                  <p className="text-xs text-gray-300">🔖 {nft.json.symbol}</p>
                )}
                {nft.json?.description && (
                  <p className="line-clamp-3 text-gray-200">
                    {nft.json.description}
                  </p>
                )}
                {nft.json?.attributes && nft.json.attributes.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-xs text-gray-400 mb-1">Attributes:</p>
                    <ul className="text-xs space-y-0.5">
                      {nft.json.attributes.slice(0, 3).map((attr: any, index: number) => (
                        <li key={index}>
                          {attr.trait_type}: <span className="font-semibold">{attr.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>            
            
            <div className="md:hidden p-3 bg-white">
              <h3 className="text-sm font-semibold">{nft.name}</h3>
              {nft.json?.symbol && (
                <p className="text-xs text-gray-500">🔖 {nft.json.symbol}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}