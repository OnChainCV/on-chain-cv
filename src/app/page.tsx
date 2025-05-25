'use client';

import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
  className: string;
  startDelay: number;
}

interface AnimatedCardProps {
  children: React.ReactNode;
  delay: number;
  animationStart: number;
}

const AnimatedText = ({ text, className, startDelay }: AnimatedTextProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, startDelay);
    return () => clearTimeout(timeoutId);
  }, [startDelay]);

  const lines = text.split('<br />');

  return (
    <div className={className}>
      {lines.map((line: string, index: number) => (
        <p
          key={index}
          className={`opacity-0 ${isVisible ? 'animate-fade-in' : ''} transition-opacity duration-1000`}
          style={{ transitionDelay: `${startDelay + index * 200}ms` }}
        >
          {line}
        </p>
      ))}
    </div>
  );
};

const AnimatedCard = ({ children, delay, animationStart }: AnimatedCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, animationStart + 500 + delay * 150);

    return () => clearTimeout(timeoutId);
  }, [animationStart, delay]);

  return (
    <div
      className={`opacity-0 translate-y-5 scale-95 transition-all duration-800 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100 animate-whirlwind-in' : ''
      } p-6 rounded-lg bg-gray-800 bg-opacity-50 hover:scale-105 hover:bg-gray-700 cursor-pointer`}
      style={{ transitionDelay: `${delay * 150}ms` }}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const text1 = "Відкрий свій Web3-Профіль:<br />Репутація, Власність, Вплив.";
  const text2 = "Створи персональну Web3 візитівку на базі Solana.<br />Підтверджуй свої досягнення NFT, демонструй репутацію в DAO<br />та володій своїми даними у блокчейні.";
  const animationStartTitle = 500;
  const animationStartSubtitle = animationStartTitle + 1200; 
  const animationStartCards = animationStartSubtitle + 1200; 

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 sm:mb-8">
          <AnimatedText text={text1} className="leading-tight" startDelay={animationStartTitle} />
        </h1>
        <div className="mb-6 sm:mb-10 text-base sm:text-lg md:text-xl text-gray-300">
          <AnimatedText text={text2} className="leading-tight" startDelay={animationStartSubtitle} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-8">
          <AnimatedCard delay={0} animationStart={animationStartCards}>
            <h3 className="font-semibold text-white mb-2 text-base sm:text-lg">🔗 Блокчейн-власність</h3>
            <p className="text-xs sm:text-sm text-left text-gray-400">Контролюй свій профіль. Зберігай свої досягнення як унікальні NFT.</p>
          </AnimatedCard>
          <AnimatedCard delay={1} animationStart={animationStartCards}>
            <h3 className="font-semibold text-white mb-2 text-base sm:text-lg">🌐 Репутація Web3</h3>
            <p className="text-xs sm:text-sm text-left text-gray-400">Твоя участь у DAO та Web3 проєктах формує твою репутацію.</p>
          </AnimatedCard>
          <AnimatedCard delay={2} animationStart={animationStartCards}>
            <h3 className="font-semibold text-white mb-2 text-base sm:text-lg">⚡ Швидкість Solana</h3>
            <p className="text-xs sm:text-sm text-left text-gray-400">Миттєве підключення та завантаження із екосистеми Solana.</p>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}