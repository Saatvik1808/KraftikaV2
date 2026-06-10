import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

async function ownAddress(req: NextRequest, id: string) {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');
  const address = await prisma.userAddress.findUnique({ where: { id } });
  if (!address || address.userId !== auth.userId) return { auth, address: null };
  return { auth, address };
}

// PUT /addresses/{id} — update own address; isDefault:true demotes others.
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const { auth, address } = await ownAddress(req, id);
  if (!address) return errorJson('Not found', 404);

  const b = await req.json();
  const updated = await prisma.$transaction(async (tx) => {
    if (b.isDefault === true) {
      await tx.userAddress.updateMany({ where: { userId: auth.userId }, data: { isDefault: false } });
    }
    return tx.userAddress.update({
      where: { id },
      data: {
        label: b.label ?? address.label,
        fullName: b.fullName ?? address.fullName,
        phone: b.phone ?? address.phone,
        street: b.street ?? address.street,
        city: b.city ?? address.city,
        state: b.state ?? address.state,
        zipCode: b.zipCode ?? address.zipCode,
        country: b.country ?? address.country,
        isDefault: b.isDefault === true ? true : address.isDefault,
      },
    });
  });
  return json({
    id: updated.id, label: updated.label, fullName: updated.fullName, phone: updated.phone,
    street: updated.street, city: updated.city, state: updated.state,
    zipCode: updated.zipCode, country: updated.country, isDefault: updated.isDefault,
  });
});

// DELETE /addresses/{id}
export const DELETE = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const { address } = await ownAddress(req, id);
  if (!address) return errorJson('Not found', 404);
  await prisma.userAddress.delete({ where: { id } });
  return json({ message: 'Address deleted' });
});
