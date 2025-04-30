'use client';

import { useEffect, useState, useRef } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, Metadata } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Nft } from '@metaplex-foundation/js';

const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = Metaplex.make(connection);

const FRAMES = ['none', 'круг', 'квадрат'];

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [frame, setFrame] = useState('none');
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!publicKey) return;
      setLoading(true);
      try {
        const all = await metaplex.nfts().findAllByOwner({ owner: publicKey });

        const fullNfts: Nft[] = await Promise.all(
          all.map(nft => metaplex.nfts().load({ metadata: nft as Metadata}))
        );

        const top10 = fullNfts
          .filter(n => n.json?.image)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 10);

        setNfts(top10);
      } catch (e) {
        console.error('Помилка під час завантаження NFT:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      const saved = localStorage.getItem(`profile_${publicKey.toBase58()}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setNickname(parsed.nickname || '');
        setAvatarId(parsed.avatarId || null);
        setSelectedNFTs(parsed.selectedNFTs || []);
        setFrame(parsed.frame || 'none');
      }
    }
  }, [publicKey]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          container.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      };

      container.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  const handleSave = () => {
    if (publicKey) {
      const data = {
        nickname,
        avatarId,
        selectedNFTs,
        frame,
        wallet: publicKey.toBase58(),
      };
      localStorage.setItem(`profile_${publicKey.toBase58()}`, JSON.stringify(data));
      alert('Профіль збережено!');
    } else {
      alert('Гаманець не підключено. Неможливо зберегти профіль.');
    }
  };

  const toggleNFT = (id: string) => {
    setSelectedNFTs(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Завантаження NFT...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Редагування профілю</h1>

      <div className="mb-4">
        <label className="block mb-2">Нікнейм:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2">Вибери фото профілю (NFT):</label>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 py-2 no-scrollbar"
          onWheel={(e) => {
            const container = e.currentTarget;
            if (e.deltaY !== 0) {
              container.scrollLeft += e.deltaY;
              e.preventDefault(); 
            }
          }}
        >
          {[...nfts, ...nfts.slice(0, 5)].map((nft, index) => (
            <div
              key={`${nft.address.toBase58()}-${index}`}
              className={`min-w-[120px] cursor-pointer rounded-lg border-4 transition-all ${avatarId === nft.address.toBase58() ? 'border-blue-500' : 'border-transparent'
                }`}
              onClick={() => setAvatarId(nft.address.toBase58())}
            >
              <img
                src={nft.json?.image || ''}
                alt={nft.name}
                className={`rounded-lg w-full h-auto object-cover ${frame !== 'none' ? `frame-${frame}` : ''
                  }`}
              />
              <p className="text-center mt-1 text-sm">{nft.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Рамка для аватара:</label>
        <select
          className="w-full p-2 border rounded"
          value={frame}
          onChange={e => setFrame(e.target.value)}
        >
          {FRAMES.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2">NFT для показу іншим:</label>
        <div className="grid grid-cols-3 gap-4">
          {nfts.map(nft => (
            <div
              key={nft.address.toBase58()}
              onClick={() => toggleNFT(nft.address.toBase58())}
              className={`cursor-pointer p-1 rounded-lg border-4 transition-all ${selectedNFTs.includes(nft.address.toBase58()) ? 'border-green-500' : 'border-transparent'
                }`}
            >
              <img src={nft.json?.image} alt={nft.name} className="rounded object-cover aspect-square" style={{ height: 'auto' }} />
              <p className="text-center text-sm">{nft.name}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 w-full"
      >
        Зберегти профіль
      </button>
    </div>
  );
}