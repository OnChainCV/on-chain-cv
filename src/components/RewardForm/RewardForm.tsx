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
      alert('Пожалуйста, подключите кошелек для получения награды');
      return;
    }

    try {     
      alert(`Поздравляем! Вы получили NFT награду!`);      
     
      setRewards(prev => 
        prev.map(r => 
          r.id === rewardId ? { ...r, claimed: true } : r
        )
      );
    } catch (error) {
      console.error('Ошибка при получении награды:', error);
      alert('Не удалось получить награду');
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Загрузка наград...</div>;
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Награды за просмотры</h2>
      <p className="text-gray-300 mb-4">
        Получайте эксклюзивные NFT за количество просмотров вашего профиля
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rewards.map(reward => (
          <div 
            key={reward.id} 
            className={`bg-gray-800 rounded-lg overflow-hidden border-2 transition-all ${
              reward.claimed ? 'border-green-500' : 'border-gray-700'
            }`}
          >
            <img 
              src={reward.image} 
              alt={reward.name} 
              className="w-full h-40 sm:h-48 object-cover"
            />
            <div className="p-3">
              <h3 className="font-bold text-white">{reward.name}</h3>
              <p className="text-sm text-gray-300 mb-2">{reward.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {reward.viewsRequired} просмотров
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  reward.claimed ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
                }`}>
                  {reward.claimed ? 'Получено' : 'Доступно'}
                </span>
              </div>
              {!reward.claimed && viewCount >= reward.viewsRequired && (
                <button
                  onClick={() => claimReward(reward.id)}
                  className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded text-sm"
                >
                  Получить
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        Ваши просмотры: <span className="font-bold text-white">{viewCount}</span>
      </div>
    </div>
  );
}
