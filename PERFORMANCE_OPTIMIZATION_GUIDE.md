# Performance Optimization Guide

## Image Optimization (Critical - 123 KiB savings)

### Hero Image (`/aesV2.jpeg`)
The hero image is currently 205.9 KiB and can be optimized to save ~122.5 KiB.

**Action Required:**
1. Convert the image to WebP or AVIF format
2. Compress the image using tools like:
   - Squoosh (https://squoosh.app/)
   - ImageOptim
   - Sharp CLI
3. Target size: ~80-90 KiB (60% reduction)

**Commands to optimize:**
```bash
# Using Sharp (if installed)
npx sharp-cli -i public/aesV2.jpeg -o public/aesV2.webp --webp

# Or use online tools:
# 1. Upload to https://squoosh.app/
# 2. Select WebP format
# 3. Adjust quality to 80-85
# 4. Download and replace the original
```

**After optimization:**
- Update the image path in `hero-section.tsx` if using WebP
- Next.js Image component will automatically serve WebP/AVIF to supported browsers

## Build Configuration

### Modern JavaScript (12 KiB savings)
- ✅ Updated `tsconfig.json` target from ES2017 to ES2020
- This reduces polyfills for modern features like:
  - Array.prototype.at
  - Array.prototype.flat
  - Object.fromEntries
  - String.prototype.trimStart/trimEnd

### Next.js Optimizations
- ✅ Enabled `swcMinify` for faster builds
- ✅ Added `optimizeCss` experimental flag
- ✅ Increased image cache TTL to 1 year
- ✅ Console removal in production (except errors/warnings)

## Code Optimizations

### Lazy Loading
- ✅ Added lazy loading for below-the-fold components:
  - ProductShowcase
  - AboutSection
  - Testimonials
  - ScentQuizSection
  - ContentSection
  - ValentineBanner

### Animation Optimizations
- ✅ Added `will-change` hints to animated elements
- ✅ Using composited properties (transform, opacity)
- ✅ Framer Motion already uses LazyMotion for code splitting

### Resource Hints
- ✅ Added preconnect for:
  - Google Tag Manager
  - Google Analytics
  - Google AdSense
- ✅ Deferred AdSense script loading

## Remaining Optimizations

### 1. Reduce Unused JavaScript (324 KiB)
- Use Next.js bundle analyzer to identify large dependencies
- Consider code splitting for heavy libraries
- Remove unused imports

### 2. Reduce Unused CSS (11 KiB)
- Next.js will automatically remove unused CSS in production
- Review Tailwind purge configuration

### 3. Optimize Network Payloads (2,684 KiB total)
- Consider lazy loading images below the fold
- Use Next.js Image component for all images
- Implement progressive image loading

### 4. Minimize Main-Thread Work (5.0s)
- Defer non-critical JavaScript
- Use Web Workers for heavy computations
- Optimize third-party scripts

### 5. Reduce JavaScript Execution Time (2.1s)
- Code split large components
- Use dynamic imports for heavy libraries
- Optimize bundle size

## Monitoring

After implementing these changes:
1. Rebuild the application: `npm run build`
2. Test with PageSpeed Insights
3. Monitor Core Web Vitals in Google Search Console
4. Check bundle size with: `npm run build -- --analyze` (if configured)

## Expected Improvements

After full optimization:
- **Performance Score**: 72 → 85-90
- **FCP**: 0.3s (already good)
- **LCP**: 1.0s → 0.8s (with image optimization)
- **TBT**: 580ms → 300-400ms
- **CLS**: 0 (already perfect)
- **SI**: 1.8s → 1.2-1.4s



