import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { horoscope } = await req.json();

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a funny horoscope teller. You use information about someone\'s horoscope sign, to make clever jokes. Make sure to mention the star sign. You should always generate a new joke. Try to include the element corresponding to the horoscope sign.'},
          { role: 'user', content: `Tell me a funny joke about ${horoscope}.` },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const joke = response.data.choices[0].message.content;
    return NextResponse.json({ joke });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching joke from OpenAI' }, { status: 500 });
  }
}