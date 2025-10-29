import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // TODO: Implement Prisma database query
    // const user = await prisma.user.findUnique({
    //   where: { email }
    // });

    // TODO: Verify password with bcrypt
    // const isValidPassword = await bcrypt.compare(password, user.password);

    // Temporary mock response
    console.log('Login attempt:', { email });
    
    return NextResponse.json(
      { 
        error: 'Database belum disetup. Silakan setup Prisma terlebih dahulu.',
        message: 'Login endpoint siap, tinggal integrasikan dengan database'
      },
      { status: 501 } // Not Implemented
    );

    // TODO: After Prisma setup, return this:
    // return NextResponse.json({
    //   message: 'Login berhasil',
    //   user: {
    //     id: user.id,
    //     name: user.name,
    //     email: user.email,
    //   }
    // });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
