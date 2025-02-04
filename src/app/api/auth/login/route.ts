import { cookies } from 'next/headers';
import {jwtDecode} from 'jwt-decode';

export async function POST(req: any) {
  try {
    const { username, password } = await req.json();

    // Faz a requisição para o backend externo
    const response: any = await fetch(`${process.env.API_URI}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      console.log({response})
      return new Response(JSON.stringify({error: response.error}), { status: 401 });
    }

    const { token } = await response.json();

    // Salva o token nos cookies
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hora
    });

    // Decodifica o token
    const decoded: {userId: string, role: string, name: string} = jwtDecode(token);
    const { userId, role, name } = decoded;

    return new Response(JSON.stringify({ user: {userId, role, name}, token }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Erro interno no servidor' }), { status: 500 });
  }
}
