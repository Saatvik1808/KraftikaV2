import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProductArraysMap } from '@/lib/product-arrays';

export const runtime = 'nodejs';
// Rendered on demand; the CDN caches it for an hour via Cache-Control below.
// (No build-time prerender — build containers have flaky DB connectivity.)
export const dynamic = 'force-dynamic';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// GET /api/merchant-feed — Google Merchant Center product feed (RSS 2.0 with
// the g: namespace). Submit this URL in Merchant Center → Products → Feeds
// to get free "Shopping" listings on Google for every candle.
export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true, stockQuantity: { gt: 0 } },
    include: { scentCategory: true },
    orderBy: { popularity: 'desc' },
  });
  const arrays = await getProductArraysMap(products.map((p) => p.id));

  const items = products
    .map((p) => {
      const imgs = arrays.get(p.id)?.imageUrls ?? [];
      const img = imgs[0] ? (imgs[0].startsWith('http') ? imgs[0] : `${SITE}${imgs[0]}`) : '';
      const extra = imgs
        .slice(1, 10)
        .map((u) => `<g:additional_image_link>${esc(u.startsWith('http') ? u : `${SITE}${u}`)}</g:additional_image_link>`)
        .join('');
      return `<item>
  <g:id>${p.id}</g:id>
  <g:title>${esc(p.name)} - Scented Soy Candle</g:title>
  <g:description>${esc((p.description ?? '').slice(0, 4900))}</g:description>
  <g:link>${SITE}/products/${p.id}</g:link>
  ${img ? `<g:image_link>${esc(img)}</g:image_link>` : ''}${extra}
  <g:availability>in_stock</g:availability>
  <g:price>${Number(p.price).toFixed(2)} INR</g:price>
  <g:brand>Kraftika</g:brand>
  <g:condition>new</g:condition>
  <g:google_product_category>Home &amp; Garden &gt; Decor &gt; Home Fragrances &gt; Candles</g:google_product_category>
  <g:product_type>${esc(p.scentCategory?.name ?? 'Scented')} Candles</g:product_type>
  <g:identifier_exists>false</g:identifier_exists>
  <g:shipping><g:country>IN</g:country><g:service>Standard</g:service><g:price>${Number(p.price) > 500 ? '0.00' : '50.00'} INR</g:price></g:shipping>
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Kraftika - Handcrafted Scented Candles</title>
<link>${SITE}</link>
<description>Premium home made scented soy candles, hand-poured in India.</description>
${items}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
