import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey   = process.env.GOOGLE_MAPS_API_KEY!;
  const placeId  = process.env.GOOGLE_PLACE_ID!;

  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=addressComponents&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch rating' }, { status: 500 });
  }

  const data = await res.json();

  const { rating, user_ratings_total } = data.result ?? {};

  return NextResponse.json({ rating, totalReviews: user_ratings_total });
}