'use client';

import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface RewardNFT {
  id: string;
  name: string;
  image: string;
  description: string;
  viewsRequired: number;
  claimed: boolean;
}

export default function RewardForm({ viewCount }: { viewCount: number }) {
  const { publicKey } = useWallet();
  const [rewards, setRewards] = useState<RewardNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const mockRewards: RewardNFT[] = [
    {
      id: '1',
      name: 'Новачок',
      image: 'https://placehold.co/200x200/4f46e5/white?text=Новачок',
      description: 'Награда за 10 просмотров профиля',
      viewsRequired: 10,
      claimed: false,
    },
    {
      id: '2',
      name: 'Популярний',
      image: 'https://placehold.co/200x200/10b981/white?text=Популярний',
      description: 'Награда за 50 просмотров профиля',
      viewsRequired: 50,
      claimed: false,
    },
    {
      id: '3',
      name: 'Зірка',
      image: 'https://placehold.co/200x200/f59e0b/white?text=Зірка',
      description: 'Награда за 100 просмотров профиля',
      viewsRequired: 100,
      claimed: false,
    },
    {
      id: '4',
      name: 'Легенда',
      image: 'https://placehold.co/200x200/ef4444/white?text=Легенда',
      description: 'Награда за 500 просмотров профиля',
      viewsRequired: 500,
      claimed: false,
    },
  ];

  useEffect(() => {
    const updatedRewards = mockRewards.map(reward => ({
      ...reward,
      claimed: viewCount >= reward.viewsRequired,
    }));
    setRewards(updatedRewards);
    setLoading(false);
  }, [viewCount]);

  const claimReward = async (rewardId: string) => {
    if (!publicKey) {
      alert('Будь ласка, підключіть гаманець для отримання нагороди');
      return;
    }

    try {
      alert(`Вітаємо! Ви отримали NFT нагороду!`);

      setRewards(prev =>
        prev.map(r =>
          r.id === rewardId ? { ...r, claimed: true } : r
        )
      );
    } catch (error) {
      console.error('Помилка при отриманні нагороди:', error);
      alert('Не вдалося отримати нагороду');
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Завантаження нагород...</div>;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 flex justify-center items-end md:items-center">
          <div className="bg-gray-900 rounded-t-2xl md:rounded-2xl p-4 w-full md:max-w-3xl md:max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Нагороди</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map(reward => (
                <div key={reward.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img src={reward.image} alt={reward.name} className="w-16 h-16 rounded-md" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{reward.name}</h3>
                      <p className="text-xs text-gray-300">{reward.description}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400">{reward.viewsRequired} переглядів</span>
                        <span className={`text-xs px-2 py-1 rounded ${reward.claimed ? 'bg-green-500' : 'bg-gray-700'}`}>
                          {reward.claimed ? 'Отримано' : 'Доступно'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!reward.claimed && viewCount >= reward.viewsRequired && (
                    <button
                      onClick={() => claimReward(reward.id)}
                      className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded text-sm"
                    >
                      Отримати
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>     
    </>
  );
}