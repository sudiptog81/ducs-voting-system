import posts from '@/lib/posts'

export async function GET(request, response) {
  return new Response(JSON.stringify(posts));
}
