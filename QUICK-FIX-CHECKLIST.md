# Quick Fix Checklist - Synura Website Issues

**Date:** October 25, 2025
**Estimated Total Time:** 30-45 minutes for critical fixes

---

## Critical Priority (Must Fix Now)

### ☐ Fix MDX Syntax Errors (10 minutes)

**Problem:** Service pages won't build - shows "Invalid or unexpected token" error

**Quick Fix:**
```bash
cd /Users/collinmclaughlin/Synurawebsite/content/services

# Replace &amp; with & in all files
sed -i '' 's/&amp;/\&/g' ai-consulting.mdx
sed -i '' 's/&amp;/\&/g' automation-integration.mdx
sed -i '' 's/&amp;/\&/g' managed-operations.mdx
sed -i '' 's/&amp;/\&/g' ai-workforce.mdx
```

**Test:**
```bash
cd /Users/collinmclaughlin/Synurawebsite
rm -rf .contentlayer
npm run build
```

**Expected:** All 23 pages should build successfully ✓

---

### ☐ Deploy Fixed Build (5 minutes)

```bash
git add content/services/*.mdx
git commit -m "Fix MDX syntax errors - replace HTML entities with plain ampersands"
git push
```

**Verify:** Check Vercel deployment completes without errors

---

## High Priority (Fix Today)

### ☐ Fix Logo Distortion (20 minutes)

**Problem:** Logo shows duplicate text and may appear distorted

**Option 1: Quick Fix (5 minutes)**

Edit `/src/components/layout/header.tsx` line 24-37:

```tsx
<Link href="/" className="flex items-center gap-3">
  <Image
    src="/images/synura-logo.svg"
    alt="Synura AI Solutions"
    width={180}
    height={108}
    className="h-12 w-auto"
    priority
  />
  {/* Remove the duplicate text div completely */}
</Link>
```

**Option 2: Better Fix (20 minutes)**

1. Create `/public/images/synura-icon.svg` (icon only, no text)
2. Update header to use icon + styled text
3. See `LOGO-FIX-GUIDE.md` for complete code

---

### ☐ Add Critical Images (1-2 hours)

**Problem:** Site uses only emoji icons, needs professional graphics

**Minimum Required:**
1. Homepage hero image or illustration
2. 4 service icons (replace emojis: 🤖 🔄 🎯 ⚙️)

**Where to Source:**
- **Create custom:** Figma, Illustrator, Canva
- **Purchase:** Unsplash, Pexels, IconScout
- **Generate:** Midjourney, DALL-E, Stable Diffusion

**Add to:** `/public/images/`

---

## File Changes Summary

### Files to Edit:

1. ✓ `/content/services/ai-consulting.mdx` - Replace &amp;
2. ✓ `/content/services/automation-integration.mdx` - Replace &amp;
3. ✓ `/content/services/managed-operations.mdx` - Replace &amp;
4. ☐ `/src/components/layout/header.tsx` - Fix logo (optional but recommended)

### Files to Create:

5. ☐ `/public/images/synura-icon.svg` - Icon-only version (optional)
6. ☐ `/public/images/hero-home.png` - Homepage hero (recommended)
7. ☐ `/public/images/service-*.svg` - Service icons (recommended)

---

## Testing After Fixes

### ☐ Local Build Test
```bash
npm run build
# Should see: ✓ Generating static pages (23/23)
```

### ☐ Local Dev Test
```bash
npm run dev
# Visit: http://localhost:3000
```

**Pages to Check:**
- [ ] Homepage loads
- [ ] Services page loads
- [ ] Click "AI Workforce Solutions" → detail page loads ✓
- [ ] Click "Automation & Integration" → detail page loads ✓
- [ ] Click "AI Consulting & Strategy" → detail page loads ✓
- [ ] Click "Managed AI Operations" → detail page loads ✓
- [ ] Logo looks correct (no duplicate text)
- [ ] Mobile menu works

### ☐ Production Test (After Deploy)
- [ ] Visit https://synura.ai (or Vercel URL)
- [ ] Check all service pages work
- [ ] Verify logo displays correctly
- [ ] Test mobile responsiveness

---

## Before and After

### Before (Current State):
- ❌ Service pages: Broken (build errors)
- ❌ Logo: Duplicate text, potentially distorted
- ❌ Images: Only 2 SVG logos, rest are emojis
- ❌ User experience: "Services page is pretty much nonfunctional"

### After Phase 1 (Critical Fixes):
- ✅ Service pages: Working (build succeeds)
- ✅ All navigation: Functional
- ⚠️ Logo: Still has minor issues
- ⚠️ Images: Still using emojis

### After Phase 2 (Visual Fixes):
- ✅ Service pages: Working perfectly
- ✅ Logo: Clean, professional appearance
- ✅ Images: Professional graphics throughout
- ✅ User experience: Polished and professional

---

## If Something Goes Wrong

### Build Still Fails?
1. Check for other HTML entities: `&lt;` `&gt;` `&quot;`
2. Look for curly quotes: `"` `"` replace with `"`
3. Check for em-dashes: `—` replace with `--`
4. Verify YAML frontmatter syntax

### Logo Still Looks Wrong?
1. Try Option 1 (remove duplicate text)
2. Check browser cache - do hard refresh (Cmd+Shift+R)
3. Verify SVG file is loading correctly
4. Check responsive breakpoints

### Images Not Showing?
1. Verify files are in `/public/images/` directory
2. Check file names match imports
3. Verify Next.js Image component syntax
4. Clear `.next` cache and rebuild

---

## Success Indicators

✅ **Build Completes:** No errors in terminal
✅ **All Pages Load:** Can navigate to every service page
✅ **No Console Errors:** Browser console is clean
✅ **Logo Looks Clean:** No duplicate or distorted text
✅ **Site Feels Professional:** Ready to show clients

---

## Next Steps After Critical Fixes

1. **Add Images:** 
   - Homepage hero
   - Service illustrations
   - Team photos

2. **Enhance Design:**
   - Add animations
   - Polish CTA sections
   - Add testimonials

3. **Performance:**
   - Run Lighthouse audit
   - Optimize images
   - Check Core Web Vitals

4. **Content:**
   - Add case studies
   - Write blog posts
   - Create resources

---

## Timeline

**Right Now (30 min):**
- Fix MDX syntax errors
- Test and deploy

**Today (1-2 hours):**
- Fix logo distortion
- Add critical images

**This Week (4-6 hours):**
- Complete image library
- Polish design
- Full QA testing

---

## Support Resources

- `WEBSITE-TESTING-SUMMARY.md` - Full analysis report
- `MDX-SYNTAX-FIXES.md` - Detailed MDX fix instructions
- `LOGO-FIX-GUIDE.md` - Complete logo fix guide
- `VISUAL-ISSUES-ANALYSIS.md` - Comprehensive visual issues

---

**Last Updated:** October 25, 2025
**Priority:** CRITICAL - Fix immediately
