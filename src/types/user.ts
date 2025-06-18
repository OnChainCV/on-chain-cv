type Profile = {
    nickname: string;
    avatarId: string;
    selectedNFTs: string[];
    frame: string;
    wallet: string;    
    totalViews?: number;
    recentViews?: number;
    company?: {
        name: string;
        wallet: string;
        position: string;
    };
};
