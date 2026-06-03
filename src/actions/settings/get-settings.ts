'use server';

import prisma from '@/lib/prisma';

export async function getSettings() {
  return prisma.appSettings.upsert({
    where:  { id: 'singleton' },
    update: {},
    create: { id: 'singleton', adminEmail: '' },
  });
}
