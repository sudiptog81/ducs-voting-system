import { getCourses } from '@/lib/db';

export async function GET(request, response) {
  return new Response(JSON.stringify(await getCourses()));
}
