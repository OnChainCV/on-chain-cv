type NFT = {
    id: string;
    name: string;
    image: string;
    mint?: string;
};

type Profile = {
    nickname: string;
    avatarId: string;
    selectedNFTs: string[];
    frame: string;
    wallet: string;
};
