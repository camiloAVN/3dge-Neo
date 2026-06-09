import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 60;

export async function GET() {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { id: 'singleton' },
      select: { heroImageMain: true, heroImageLeft: true, heroImageRight: true },
    });
    return NextResponse.json({
      heroImageMain:  settings?.heroImageMain  ?? null,
      heroImageLeft:  settings?.heroImageLeft  ?? null,
      heroImageRight: settings?.heroImageRight ?? null,
    });
  } catch {
    return NextResponse.json({ heroImageMain: null, heroImageLeft: null, heroImageRight: null });
  }
}
