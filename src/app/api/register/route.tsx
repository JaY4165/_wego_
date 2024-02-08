import { type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { body } = req;
  // const { username, password } = body;

  return Response.json({
    hello: 'world',
  });
}
