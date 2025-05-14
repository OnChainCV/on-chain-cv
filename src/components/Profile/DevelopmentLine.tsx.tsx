import React, { CSSProperties } from 'react';

interface NFT {
  address: {
    toBase58: () => string;
  };
  name?: string;
  json?: {
    image?: string;
  };
}

interface DevelopmentLineProps {
  nfts: NFT[];
  selectedNFTs: string[];
}

const DevelopmentLine: React.FC<DevelopmentLineProps> = ({ nfts, selectedNFTs }) => {
  const filteredNfts = nfts.filter(nft => selectedNFTs.includes(nft.address.toBase58()));
  const shouldScroll = filteredNfts.length > 5;
  const containerStyle: CSSProperties = {
    maxHeight: shouldScroll ? '400px' : 'auto',
    overflowY: shouldScroll ? 'auto' : 'hidden',
  };

  return (
    <div className="relative" style={containerStyle}>
      
      <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 z-0"></div>
      <div className="flex flex-col space-y-6 z-10">
        {filteredNfts.map((nft, index) => (
          <div
            key={nft.address.toBase58()}
            className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            {index % 2 === 0 && (
              <div className="w-1/2 flex justify-end pr-4">
                <div className="relative w-8 h-8 rounded-full shadow-md overflow-hidden">
                  {nft.json?.image && (
                    <img
                      src={nft.json.image}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}
            
            <div className="w-2 h-2 rounded-full bg-blue-500 z-20"></div>
            {index % 2 !== 0 && (
              <div className="w-1/2 flex justify-start pl-4">
                <div className="relative w-8 h-8 rounded-full shadow-md overflow-hidden">
                  {nft.json?.image && (
                    <img
                      src={nft.json.image}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentLine;