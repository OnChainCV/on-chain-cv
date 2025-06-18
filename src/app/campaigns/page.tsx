'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface Company {
  id: string;
  name: string;
  description: string;
  logo: string;
  industry: string;
  location: string;
  openPositions: number;
  totalEmployees: number;
  averageRating: number;
  status: 'hiring' | 'closed' | 'coming_soon';
  positions: {
    title: string;
    type: 'full-time' | 'part-time' | 'contract';
    salary: string;
    requirements: string[];
  }[];
  stats: {
    totalApplicants: number;
    successfulHires: number;
    averageResponseTime: string;
  };
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Web3 Solutions',
    description: 'Leading blockchain development company specializing in DeFi and NFT solutions.',
    logo: 'https://picsum.photos/seed/company1/400/200',
    industry: 'Blockchain Development',
    location: 'Kyiv, Ukraine',
    openPositions: 5,
    totalEmployees: 120,
    averageRating: 4.8,
    status: 'hiring',
    positions: [
      {
        title: 'Senior Solana Developer',
        type: 'full-time',
        salary: '$80k - $120k',
        requirements: ['5+ years of experience', 'Strong Solana knowledge', 'Rust programming']
      },
      {
        title: 'Smart Contract Auditor',
        type: 'contract',
        salary: '$100k - $150k',
        requirements: ['Security background', 'Experience with audits', 'Solidity expertise']
      }
    ],
    stats: {
      totalApplicants: 234,
      successfulHires: 15,
      averageResponseTime: '2 days'
    }
  },
  {
    id: '2',
    name: 'NFT Marketplace',
    description: 'Innovative NFT trading platform with focus on digital art and collectibles.',
    logo: 'https://picsum.photos/seed/company2/400/200',
    industry: 'NFT & Digital Art',
    location: 'Remote',
    openPositions: 3,
    totalEmployees: 45,
    averageRating: 4.6,
    status: 'hiring',
    positions: [
      {
        title: 'Frontend Developer',
        type: 'full-time',
        salary: '$70k - $90k',
        requirements: ['React experience', 'Web3 knowledge', 'UI/UX skills']
      }
    ],
    stats: {
      totalApplicants: 156,
      successfulHires: 8,
      averageResponseTime: '3 days'
    }
  },
  {
    id: '3',
    name: 'DeFi Protocol',
    description: 'Next-generation decentralized finance protocol with innovative yield strategies.',
    logo: 'https://picsum.photos/seed/company3/400/200',
    industry: 'DeFi',
    location: 'Lviv, Ukraine',
    openPositions: 0,
    totalEmployees: 30,
    averageRating: 4.9,
    status: 'coming_soon',
    positions: [],
    stats: {
      totalApplicants: 0,
      successfulHires: 0,
      averageResponseTime: 'N/A'
    }
  },
  {
    id: '4',
    name: 'Blockchain Gaming Studio',
    description: 'Creating the future of gaming with blockchain technology and play-to-earn mechanics.',
    logo: 'https://picsum.photos/seed/company4/400/200',
    industry: 'Gaming',
    location: 'Kyiv, Ukraine',
    openPositions: 4,
    totalEmployees: 85,
    averageRating: 4.7,
    status: 'hiring',
    positions: [
      {
        title: 'Game Developer',
        type: 'full-time',
        salary: '$60k - $90k',
        requirements: ['Unity/Unreal experience', 'C++/C#', 'Game design']
      },
      {
        title: 'Blockchain Integration Engineer',
        type: 'full-time',
        salary: '$80k - $110k',
        requirements: ['Web3 experience', 'Game development', 'Smart contracts']
      }
    ],
    stats: {
      totalApplicants: 189,
      successfulHires: 12,
      averageResponseTime: '2 days'
    }
  }
];

export default function CampaignsPage() {
  const { publicKey } = useWallet();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'hiring' | 'closed' | 'coming_soon'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'positions' | 'employees'>('rating');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = mockCompanies
    .filter(company => selectedStatus === 'all' || company.status === selectedStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'positions':
          return b.openPositions - a.openPositions;
        case 'employees':
          return b.totalEmployees - a.totalEmployees;
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Компанії та Вакансії</h1>

      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
        >
          <option value="all">Всі компанії</option>
          <option value="hiring">Шукають працівників</option>
          <option value="coming_soon">Скоро відкриються</option>
          <option value="closed">Закриті</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
        >
          <option value="rating">За рейтингом</option>
          <option value="positions">За кількістю вакансій</option>
          <option value="employees">За розміром компанії</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  company.status === 'hiring' ? 'bg-green-500' :
                  company.status === 'closed' ? 'bg-gray-500' :
                  'bg-blue-500'
                }`}>
                  {company.status === 'hiring' ? 'Шукають працівників' :
                   company.status === 'closed' ? 'Закриті' :
                   'Скоро відкриються'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
              <p className="text-gray-400 mb-2">{company.industry}</p>
              <p className="text-gray-400 mb-4">{company.location}</p>
              <p className="text-gray-400 mb-4 line-clamp-2">{company.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">Вакансій</p>
                  <p className="text-lg font-semibold">{company.openPositions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Співробітників</p>
                  <p className="text-lg font-semibold">{company.totalEmployees}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Рейтинг</p>
                  <p className="text-lg font-semibold">{company.averageRating.toFixed(1)}</p>
                </div>
              </div>

              {company.positions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Відкриті позиції:</h3>
                  <div className="space-y-2">
                    {company.positions.map((position, index) => (
                      <div key={index} className="bg-gray-700 p-2 rounded">
                        <p className="font-medium">{position.title}</p>
                        <p className="text-sm text-gray-400">{position.type} • {position.salary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-400 mb-4">
                <p>Всього заявок: {company.stats.totalApplicants}</p>
                <p>Успішних наймів: {company.stats.successfulHires}</p>
                <p>Середній час відповіді: {company.stats.averageResponseTime}</p>
              </div>

              <button
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors duration-300"
                onClick={() => {
                  if (!publicKey) {
                    alert('Будь ласка, підключіть гаманець для подачі заявки');
                    return;
                  }
                  setSelectedCompany(company);
                  // Handle application
                  alert('Функція подачі заявки буде додана пізніше');
                }}
              >
                {company.status === 'hiring' ? 'Подати заявку' :
                 company.status === 'coming_soon' ? 'Підписатися на оновлення' :
                 'Переглянути деталі'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 