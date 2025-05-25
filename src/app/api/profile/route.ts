import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db' 


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get('wallet')

    if (!wallet || typeof wallet !== 'string') {
      return NextResponse.json({ error: 'Missing wallet' }, { status: 400 })
    }

    const db = await connectToDB()
    const collection = db.collection('profiles')

    const profile = await collection.findOne({ wallet })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    return NextResponse.json(profile, { status: 200 })

  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



export async function POST(req: Request) {
  try {
    const db = await connectToDB()
    const collection = db.collection('profiles')

    const body = await req.json()
    const { wallet, nickname, avatarId, selectedNFTs, frame } = body

    if (!wallet) {
      return NextResponse.json({ error: 'Missing wallet' }, { status: 400 })
    }

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

    return NextResponse.json({ message: 'Profile saved' }, { status: 200 })

  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}