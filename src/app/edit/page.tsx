"use client"
import { useEffect, useState } from 'react';

const MOCK_NFTS: NFT[] = [
  { id: '1', name: 'NFT Dragon', image: '/nfts/dragon.png' },
  { id: '2', name: 'Crypto Kitty', image: '/nfts/kitty.png' },
  { id: '3', name: 'Pixel Ape', image: '/nfts/ape.png' },
];

const FRAMES = ['none', 'gold', 'silver', 'rainbow'];

const WALLET_ADDRESS = '7H9Abc123xyz'; 

export default function EditProfile() {
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [frame, setFrame] = useState('none');

  useEffect(() => {
    const saved = localStorage.getItem(`profile_${WALLET_ADDRESS}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setNickname(parsed.nickname || '');
      setAvatarId(parsed.avatarId || null);
      setSelectedNFTs(parsed.selectedNFTs || []);
      setFrame(parsed.frame || 'none');
    }
  }, []);

  const handleSave = () => {
    const data = {
      nickname,
      avatarId,
      selectedNFTs,
      frame,
      wallet: WALLET_ADDRESS,
    };
    localStorage.setItem(`profile_${WALLET_ADDRESS}`, JSON.stringify(data));
    alert('Профіль збережено!');
  };

  const toggleNFT = (id: string) => {
    setSelectedNFTs(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

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
          {MOCK_NFTS.map(nft => (
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
                className={`rounded-lg w-full h-auto ${
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
          {MOCK_NFTS.map(nft => (
            <div
              key={nft.id}
              onClick={() => toggleNFT(nft.id)}
              className={`cursor-pointer p-1 rounded-lg border-4 transition-all ${
                selectedNFTs.includes(nft.id) ? 'border-green-500' : 'border-transparent'
              }`}
            >
              <img src={nft.image} alt={nft.name} className="rounded" />
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
