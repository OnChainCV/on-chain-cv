'use client';

import { useEffect, useState, useRef } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { Metaplex} from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Nft } from '@metaplex-foundation/js';
import pLimit from 'p-limit';
import RewardForm from '@/components/RewardForm/RewardForm';


const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = Metaplex.make(connection);
const ITEMS_PER_PAGE = 10;
const FRAMES = ['none', 'круг', 'квадрат'];

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [frame, setFrame] = useState('none');
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [recentViews, setRecentViews] = useState<number>(0);
  const [allNfts, setAllNfts] = useState<Nft[]>([]);
  const [avatarChoices, setAvatarChoices] = useState<Nft[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRewardForm, setShowRewardForm] = useState(false);  

  const paginatedNfts = allNfts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(allNfts.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchViewStats = async () => {
      if (!publicKey) return;

      try {
        const res = await fetch(`/api/profile/views?wallet=${publicKey.toBase58()}`);
        if (res.ok) {
          const data = await res.json();
          setViewCount(data.totalViews || 0);
          setRecentViews(data.recentViews || 0);
        }
      } catch (error) {
        console.error('Error fetching view stats:', error);
      }
    };

    fetchViewStats();
  }, [publicKey]);

  useEffect(() => {
    const fetchNFTs = async () => {
      const cookieKey = `view_count_${publicKey}`;
      const current = parseInt(getCookie(cookieKey) || '0');
      setViewCount(current);
      if (!publicKey) return;
      setLoading(true);
      try {
        const all = await metaplex.nfts().findAllByOwner({ owner: publicKey });

        const limit = pLimit(1);

        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

        const fullNfts = await Promise.all(
          all
            .filter((nft) => nft.model === 'metadata')
            .map((nft) =>
              limit(async () => {
                await delay(100);
                return await metaplex.nfts().load({ metadata: nft });
              })
            )
        );

        const withImages = fullNfts.filter((n): n is Nft => n.model === 'nft' && !!n.json?.image);
        const top10 = withImages.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 5);

        setAllNfts(withImages);
        setAvatarChoices(top10);
      } catch (e) {
        console.error('Помилка під час завантаження NFT:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [publicKey]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!publicKey) return;

      try {
        const res = await fetch(`/api/profile?wallet=${publicKey.toBase58()}`);
        if (!res.ok) throw new Error('Profile not found');
        const data = await res.json();

        setNickname(data.nickname || '');
        setAvatarId(data.avatarId || null);
        setSelectedNFTs(data.selectedNFTs || []);
        setFrame(data.frame || 'none');
      } catch (error) {
        console.log('No saved profile or error:', error);
      }
    };

    fetchProfile();
  }, [publicKey]);

  const handleSave = async () => {
    if (!publicKey) {
      alert('Гаманець не підключено. Неможливо зберегти профіль.');
      return;
    }

    const data = {
      wallet: publicKey.toBase58(),
      nickname,
      avatarId,
      selectedNFTs,
      frame,
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Профіль збережено!');
      } else {
        alert('Помилка збереження профілю');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Помилка при збереженні');
    }
  };


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

  const toggleNFT = (id: string) => {
    setSelectedNFTs(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Завантаження NFT...</div>;
  }

  return (
    <div className="mt-20 max-w-2xl mx-auto p-4 sm:p-6">      
        <RewardForm viewCount={viewCount} />      
      {/* <div className="mb-4">
        <label className="block mb-2 text-sm sm:text-base">Нікнейм:</label>
        <input
          type="text"
          className="w-full p-2 border rounded text-sm sm:text-base"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
      </div> */}

      <div className="mb-">
        <label className="block mb-2 text-sm sm:text-base">Вибери фото профілю (NFT):</label>
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
          {avatarChoices.map((nft, index) => (
            <div
              key={`${nft.address.toBase58()}-${index}`}
              className={`min-w-[100px] sm:min-w-[120px] cursor-pointer rounded-lg border-4 transition-all ${avatarId === nft.address.toBase58() ? 'border-blue-500' : 'border-transparent'
                }`}
              onClick={() => setAvatarId(nft.address.toBase58())}
            >
              <img
                src={nft.json?.image || ''}
                alt={nft.name}
                className={`rounded-lg w-full h-auto object-cover ${frame !== 'none' ? `frame-${frame}` : ''
                  }`}
              />
              <p className="text-center mt-1 text-xs sm:text-sm truncate px-1">{nft.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm sm:text-base">Рамка для аватара:</label>
        <select
          className="w-full p-2 border rounded bg-black text-sm sm:text-base"
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
        <label className="block mb-2 text-sm sm:text-base">NFT для показу іншим:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {paginatedNfts.map(nft => (
            <div
              key={nft.address.toBase58()}
              onClick={() => toggleNFT(nft.address.toBase58())}
              className={`cursor-pointer p-1 rounded-lg border-4 transition-all ${selectedNFTs.includes(nft.address.toBase58()) ? 'border-green-500' : 'border-transparent'
                }`}
            >
              <img src={nft.json?.image} alt={nft.name} className="rounded object-cover aspect-square" style={{ height: 'auto' }} />
              <p className="text-center text-xs sm:text-sm truncate px-1">{nft.name}</p>
            </div>
          ))}
        </div>

        
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
            >
              Назад
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-gray-700'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
            >
              Вперед
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-xs sm:text-sm text-gray-500 mb-4">
        <p>
          Всього переглядів: <span className="font-semibold text-white">{viewCount}</span>
          <span className="mx-2">|</span>
          За 24 години: <span className="font-semibold text-white">{recentViews}</span>
        </p>
      </div>

      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-indigo-700 w-full text-sm sm:text-base"
      >
        Зберегти профіль
      </button>
    </div>
  );
}