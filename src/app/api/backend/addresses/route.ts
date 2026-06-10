import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const serialize = (a: {
  id: string; label: string | null; fullName: string | null; phone: string | null;
  street: string; city: string; state: string; zipCode: string; country: string;
  isDefault: boolean;
}) => ({
  id: a.id,
  label: a.label,
  fullName: a.fullName,
  phone: a.phone,
  street: a.street,
  city: a.city,
  state: a.state,
  zipCode: a.zipCode,
  country: a.country,
  isDefault: a.isDefault,
});

// GET /addresses — caller's saved addresses, default first.
export const GET = withErrorHandling(async (req: NextRequest) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');
  const addresses = await prisma.userAddress.findMany({
    where: { userId: auth.userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
  return json(addresses.map(serialize));
});

// POST /addresses — add address. First address (or isDefault:true) becomes default.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');
  const b = await req.json();
  for (const f of ['street', 'city', 'state', 'zipCode']) {
    if (!b[f]) throw new ApiError(400, `${f} is required`);
  }
  const count = await prisma.userAddress.count({ where: { userId: auth.userId } });
  const makeDefault = count === 0 || b.isDefault === true;

  const created = await prisma.$transaction(async (tx) => {
    if (makeDefault) {
      await tx.userAddress.updateMany({ where: { userId: auth.userId }, data: { isDefault: false } });
    }
    return tx.userAddress.create({
      data: {
        userId: auth.userId,
        label: b.label ?? null,
        fullName: b.fullName ?? null,
        phone: b.phone ?? null,
        street: b.street,
        city: b.city,
        state: b.state,
        zipCode: b.zipCode,
        country: b.country || 'India',
        isDefault: makeDefault,
      },
    });
  });
  return json(serialize(created), 201);
});
