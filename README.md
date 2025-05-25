# OnChainCV — Web3 Profile with NFTs, Reputation, and Transparent Achievements

**Decentralized user profile on Solana:** show who you are in the Web3 ecosystem — through NFTs, badges, and activity. Ideal for DAOs, freelancers, and hackathons.

## Project Description

OnChainCV is a platform for creating a personal Web3 profile that stores information about achievements, NFTs, participation in events or hackathons directly on the Solana blockchain.

This is not just a profile — it's your digital Web3 resume that:

✅ Displays your unique NFTs (as certificates, badges, or avatars)
✅ Allows profile customization (nickname, frames, NFT showcase)
✅ Publicly shows the number of views your profile has received
✅ Saves settings locally or on the blockchain (in the future)
✅ Works with any wallet through @solana/wallet-adapter

## Who is this project for?

- Hackathon and competition participants
- DAO and Web3 community members
- Freelancers who want a public, transparent resume
- NFT artists or collectors
- Web3 projects that want to see user backgrounds

## Functionality

| Feature             | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| 🎭 Avatar Selection   | Choose any of your NFTs as your avatar                                    |
| 🖼️ NFT Showcase      | Display a selection of your NFTs as part of your public profile              |
| 🎨 Avatar Frames     | Add style: square, circle, or no frame                                     |
| 📝 Nickname Editing  | Your chosen name in the Web3 ecosystem                                    |
| 👁️ View Counter      | Shows how many times your profile has been viewed                         |
| 💾 Saving            | Settings are saved in MongoDB                                               |
| 🔒 Wallet Support    | Integration with Solana Wallet Adapter                                      |

## Tech Stack

- **Next.js** (React + SSR)
- **TypeScript**
- **TailwindCSS** — UI
- **Solana Web3.js** — network interaction
- **Metaplex JS SDK** — NFT loading
- **Wallet Adapter** — support for Phantom and other wallets
- **localStorage** — profile saving

## How does it work?

1.  User connects their wallet (e.g., Phantom)
2.  All their NFTs from the Solana network are loaded
3.  They can:
    - Choose an avatar
    - Select several NFTs for public display