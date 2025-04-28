'use client';

import { useEffect, useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, Metadata } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';

const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = Metaplex.make(connection);

const FRAMES = ['none', 'круг', 'квадрат'];

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [frame, setFrame] = useState('none');
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!publicKey) return;
      try {
        const foundNfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });

        const userNFTs: NFT[] = await Promise.all(
          foundNfts
            .filter((nft) => 'metadataAccount' in nft)
            .map(async (nft) => {
              const metadata = await metaplex.nfts().load({ metadata: nft as Metadata });
              return {
                id: metadata.address.toBase58(),
                name: metadata.name,
                image: metadata.json?.image || '',
              };
            })
        );

        setNfts(userNFTs);
      } catch (error) {
        console.error('Помилка при отриманні NFT:', error);
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
        <div className="grid grid-cols-3 gap-4">
          {nfts.map(nft => (
            <div
              key={nft.id}
              className={`cursor-pointer rounded-lg border-4 transition-all ${
                avatarId === nft.id ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => setAvatarId(nft.id)}
            >
              <img
                src={nft.image}
                alt={nft.name}
                className={`rounded-lg w-full h-auto object-cover ${
                  frame !== 'none' ? `frame-${frame}` : ''
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
              key={nft.id}
              onClick={() => toggleNFT(nft.id)}
              className={`cursor-pointer p-1 rounded-lg border-4 transition-all ${
                selectedNFTs.includes(nft.id) ? 'border-green-500' : 'border-transparent'
              }`}
            >
              <img src={nft.image} alt={nft.name} className="rounded object-cover aspect-square" style={{ height: 'auto' }} />
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