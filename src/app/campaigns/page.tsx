'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface CompanyProfile {
  name: string;
  wallet: string;
  position: string;
}

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

export default function CampaignsPage() {
  const { publicKey } = useWallet();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'hiring' | 'closed' | 'coming_soon'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'positions' | 'employees'>('rating');  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: '',
    wallet: publicKey?.toBase58() || '',
    position: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {      
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey?.toBase58(),
          company: companyProfile
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при сохранении профиля компании');
      }

      alert('Профиль компании успешно создан!');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при создании профиля компании');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Компанії та Вакансії</h1>

      {!showCreateForm ? (
        <>
          <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
            <div className="flex gap-4">
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

            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Створити профіль компанії
            </button>
          </div>          
        </>
      ) : (
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Створення профілю компанії</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Назва компанії</label>
              <input
                type="text"
                name="name"
                value={companyProfile.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Ваша посада</label>
              <input
                type="text"
                name="position"
                value={companyProfile.position}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Гаманець компанії (Solana)</label>
              <input
                type="text"
                name="wallet"
                value={companyProfile.wallet}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                pattern="[1-9A-HJ-NP-Za-km-z]{32,44}"
                title="Введите корректный Solana адрес"
              />
              {publicKey && (
                <button
                  type="button"
                  onClick={() => setCompanyProfile(prev => ({
                    ...prev,
                    wallet: publicKey.toBase58()
                  }))}
                  className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Використати мій поточний гаманець
                </button>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Збереження...' : 'Зберегти профіль'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}