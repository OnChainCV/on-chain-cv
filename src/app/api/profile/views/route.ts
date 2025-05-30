import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get('wallet')
    const viewerWallet = searchParams.get('viewerWallet')

    if (!wallet || !viewerWallet) {
      return NextResponse.json({ error: 'Missing wallet or viewer wallet' }, { status: 400 })
    }

    const db = await connectToDB()
    const viewsCollection = db.collection('profileViews')
    const profilesCollection = db.collection('profiles')

    
    const lastView = await viewsCollection.findOne({
      profileWallet: wallet,
      viewerWallet,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })

    if (lastView) {
      return NextResponse.json({ message: 'View already counted' }, { status: 200 })
    }

    
    await viewsCollection.insertOne({
      profileWallet: wallet,
      viewerWallet,
      timestamp: new Date()
    })

   
    const recentViews = await viewsCollection.countDocuments({
      profileWallet: wallet,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })

    
    const reward = Math.floor(recentViews / 10)

    
    await profilesCollection.updateOne(
      { wallet },
      { $set: { currentReward: reward } }
    )

    return NextResponse.json({ 
      message: 'View recorded',
      currentReward: reward,
      recentViews
    }, { status: 200 })

  } catch (error) {
    console.error('Error recording profile view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json({ error: 'Missing wallet' }, { status: 400 })
    }

    const db = await connectToDB()
    const viewsCollection = db.collection('profileViews')

  
    const totalViews = await viewsCollection.countDocuments({ profileWallet: wallet })

    
    const recentViews = await viewsCollection.countDocuments({
      profileWallet: wallet,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })

    return NextResponse.json({
      totalViews,
      recentViews,
      currentReward: Math.floor(recentViews / 10)
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching profile views:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 