import posts from '@/lib/posts'
import { getServerSession } from 'next-auth';

export async function GET(request, response) {
  const session = await getServerSession({req: request});

  if (!session) {
    return Response.json({error: 'Unauthorized'}, {status: 401});
  }

  return new Response(JSON.stringify(await posts()));
}
