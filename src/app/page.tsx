import Link from 'next/link';

export default function Home() {
  const isWalletConnected = true;

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Web3 Профіль в майбутньому
        </h1>

        <div className="mb-8">
          {isWalletConnected ? (
            <div className="text-lg text-green-600 mb-4">
              <span>Гаманець підключено!</span>
            </div>
          ) : (
            <div className="text-lg text-red-600 mb-4">
              <span>Гаманець не підключено</span>
            </div>
          )}

          <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 mb-4">
            {isWalletConnected ? 'Підключений' : 'Підключити гаманець'}
          </button>
        </div>

        <Link href="/edit">

          <button className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300">
            Редагувати профіль
          </button>

        </Link>
      </div>
    </div>
  );
}
