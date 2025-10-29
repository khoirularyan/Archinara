import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // TODO: Implement Prisma database query
    // Check if user exists
    // const existingUser = await prisma.user.findUnique({
    //   where: { email }
    // });

    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: 'Email sudah terdaftar' },
    //     { status: 400 }
    //   );
    // }

    // TODO: Hash password with bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Create user in database
    // const user = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //   }
    // });

    // Temporary mock response
    console.log('Signup attempt:', { name, email });
    
    return NextResponse.json(
      { 
        error: 'Database belum disetup. Silakan setup Prisma terlebih dahulu.',
        message: 'Signup endpoint siap, tinggal integrasikan dengan database'
      },
      { status: 501 } // Not Implemented
    );

    // TODO: After Prisma setup, return this:
    // return NextResponse.json(
    //   { 
    //     message: 'Pendaftaran berhasil',
    //     user: {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //     }
    //   },
    //   { status: 201 }
    // );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat pendaftaran' },
      { status: 500 }
    );
  }
}
