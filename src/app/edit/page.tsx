"use client"
import { useState, useEffect } from 'react';

const DEFAULT_PROFILE = {
  name: '',
  frame: 'none',
  achievements: [] as string[],
};

const ACHIEVEMENTS_LIST = ['Early Adopter', 'DAO Contributor', 'NFT Creator'];

export default function EditProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    const saved = localStorage.getItem('profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem('profile', JSON.stringify(profile));
    alert('Профіль збережено!');
  };

  const toggleAchievement = (a: string) => {
    setProfile(prev => ({
      ...prev,
      achievements: prev.achievements.includes(a)
        ? prev.achievements.filter(item => item !== a)
        : [...prev.achievements, a],
    }));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Редагування профілю</h1>

      <label className="block mb-2">Ім’я:</label>
      <input
        className="w-full p-2 mb-4 border rounded"
        value={profile.name}
        onChange={e => setProfile({ ...profile, name: e.target.value })}
      />

      <label className="block mb-2">Рамка профілю:</label>
      <select
        className="w-full p-2 mb-4 border rounded"
        value={profile.frame}
        onChange={e => setProfile({ ...profile, frame: e.target.value })}
      >
        <option value="none">Без рамки</option>
        <option value="gold">Золота</option>
        <option value="silver">Срібна</option>
        <option value="rainbow">Райдужна</option>
      </select>

      <label className="block mb-2">Досягнення:</label>
      <div className="mb-4">
        {ACHIEVEMENTS_LIST.map((ach, idx) => (
          <label key={idx} className="inline-flex items-center mr-3 mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={profile.achievements.includes(ach)}
              onChange={() => toggleAchievement(ach)}
            />
            {ach}
          </label>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        Зберегти
      </button>
    </div>
  );
}
