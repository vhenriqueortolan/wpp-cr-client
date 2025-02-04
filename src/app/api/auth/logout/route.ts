import { cookies } from 'next/headers';

export async function POST() {
  (await cookies()).set('token', '', { maxAge: 0, path: '/' });
  return new Response(JSON.stringify({ message: 'Logout realizado com sucesso' }), { status: 200 });
}