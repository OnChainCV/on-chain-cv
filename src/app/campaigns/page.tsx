'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  totalViews: number;
  averageRating: number;
  status: 'active' | 'completed' | 'upcoming';
  image: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Web3 Developer Challenge',
    description: 'Build innovative dApps and showcase your skills in this developer-focused campaign.',
    startDate: '2024-03-01',
    endDate: '2024-04-01',
    participants: 156,
    totalViews: 2345,
    averageRating: 4.8,
    status: 'active',
    image: 'https://picsum.photos/seed/campaign1/400/200'
  },
  {
    id: '2',
    title: 'NFT Artist Showcase',
    description: 'Showcase your NFT artwork and get discovered by collectors and galleries.',
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    participants: 89,
    totalViews: 1567,
    averageRating: 4.6,
    status: 'active',
    image: 'https://picsum.photos/seed/campaign2/400/200'
  },
  {
    id: '3',
    title: 'DeFi Protocol Competition',
    description: 'Design and implement innovative DeFi protocols for the future of finance.',
    startDate: '2024-04-01',
    endDate: '2024-05-01',
    participants: 0,
    totalViews: 0,
    averageRating: 0,
    status: 'upcoming',
    image: 'https://picsum.photos/seed/campaign3/400/200'
  },
  {
    id: '4',
    title: 'Blockchain Gaming Tournament',
    description: 'Compete in the ultimate blockchain gaming tournament with real prizes.',
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    participants: 245,
    totalViews: 5678,
    averageRating: 4.9,
    status: 'completed',
    image: 'https://picsum.photos/seed/campaign4/400/200'
  }
];

export default function CampaignsPage() {
  const { publicKey } = useWallet();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'views' | 'participants'>('rating');

  const filteredCampaigns = mockCampaigns
    .filter(campaign => selectedStatus === 'all' || campaign.status === selectedStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'views':
          return b.totalViews - a.totalViews;
        case 'participants':
          return b.participants - a.participants;
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Кампанії та Рейтинги</h1>

      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
        >
          <option value="all">Всі кампанії</option>
          <option value="active">Активні</option>
          <option value="completed">Завершені</option>
          <option value="upcoming">Майбутні</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
        >
          <option value="rating">За рейтингом</option>
          <option value="views">За переглядами</option>
          <option value="participants">За учасниками</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  campaign.status === 'active' ? 'bg-green-500' :
                  campaign.status === 'completed' ? 'bg-gray-500' :
                  'bg-blue-500'
                }`}>
                  {campaign.status === 'active' ? 'Активна' :
                   campaign.status === 'completed' ? 'Завершена' :
                   'Майбутня'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
              <p className="text-gray-400 mb-4 line-clamp-2">{campaign.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">Учасники</p>
                  <p className="text-lg font-semibold">{campaign.participants}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Перегляди</p>
                  <p className="text-lg font-semibold">{campaign.totalViews}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Рейтинг</p>
                  <p className="text-lg font-semibold">{campaign.averageRating.toFixed(1)}</p>
                </div>
              </div>

              <div className="text-sm text-gray-400 mb-4">
                <p>Початок: {new Date(campaign.startDate).toLocaleDateString()}</p>
                <p>Завершення: {new Date(campaign.endDate).toLocaleDateString()}</p>
              </div>

              <button
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors duration-300"
                onClick={() => {
                  if (!publicKey) {
                    alert('Будь ласка, підключіть гаманець для участі');
                    return;
                  }
                  // Handle participation
                  alert('Функція участі буде додана пізніше');
                }}
              >
                {campaign.status === 'upcoming' ? 'Зареєструватися' :
                 campaign.status === 'active' ? 'Приєднатися' :
                 'Переглянути результати'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 