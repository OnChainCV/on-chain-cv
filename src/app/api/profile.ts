import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDB } from '@/lib/db' 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDB()
  const collection = db.collection('profiles')

  if (req.method === 'GET') {
    const { wallet } = req.query
    if (!wallet || typeof wallet !== 'string') return res.status(400).json({ error: 'Missing wallet' })

    const profile = await collection.findOne({ wallet })
    if (!profile) return res.status(404).json({ error: 'Profile not found' })

    return res.status(200).json(profile)
  }

  if (req.method === 'POST') {
    const { wallet, nickname, avatarId, selectedNFTs, frame } = req.body
    if (!wallet) return res.status(400).json({ error: 'Missing wallet' })

    await collection.updateOne(
      { wallet },
      {
        $set: {
          wallet,
          nickname,
          avatarId,
          selectedNFTs,
          frame,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return res.status(200).json({ message: 'Profile saved' })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
