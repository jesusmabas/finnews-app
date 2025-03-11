import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  
  try {
    const assetsSnapshot = await admin.firestore()
      .collection('assets')
      .where('userId', '==', userId)
      .orderBy('symbol', 'asc')
      .get();
    
    const assets = assetsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || null
    }));
    
    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Error getting assets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, symbol, name } = await request.json();
    
    if (!userId || !symbol || !name) {
      return NextResponse.json({ error: 'userId, symbol, and name are required' }, { status: 400 });
    }
    
    const assetRef = await admin.firestore().collection('assets').add({
      userId,
      symbol: symbol.toUpperCase(),
      name,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return NextResponse.json({ 
      success: true, 
      assetId: assetRef.id,
      symbol,
      name 
    });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}