# Logo Distortion Fix - Visual Analysis & Solution

**Date:** October 25, 2025
**Issue:** Logo appears distorted or displays redundant text in the header

---

## Current Implementation Analysis

### File Location
`/Users/collinmclaughlin/Synurawebsite/src/components/layout/header.tsx`

### Current Code (Lines 24-37)

```tsx
<div className="flex items-center">
  <Link href="/" className="flex items-center space-x-2">
    <Image
      src="/images/synura-logo.svg"
      alt="Synura AI Solutions"
      width={200}
      height={120}
      className="h-10 w-auto"
    />
    <div className="flex flex-col">
      <span className="text-xl font-bold text-primary-700">Synura</span>
      <span className="text-xs text-secondary-600 -mt-1">AI Solutions</span>
    </div>
  </Link>
</div>
```

---

## Problem Identified

### Issue 1: Double Text Display

The SVG logo file (`/public/images/synura-logo.svg`) contains:
- Gear/circuit icon graphic
- "SYNURA" text (font-size: 28px, font-weight: 700)
- "AI SOLUTIONS" text (font-size: 14px, letter-spacing: 2px)

The React component ALSO displays:
- "Synura" text (text-xl font-bold)
- "AI Solutions" text (text-xs)

**Result:** The text appears TWICE - once in the SVG and once in the HTML

### Visual Representation

```
Current (Redundant):
┌─────────────────────────────────────────────────┐
│ [Gear Icon]                                      │
│   SYNURA            Synura                       │
│   AI SOLUTIONS      AI Solutions                 │
│     ↑                  ↑                         │
│   In SVG           In React                      │
└─────────────────────────────────────────────────┘
```

---

### Issue 2: Aspect Ratio Conflicts

**SVG Properties:**
- viewBox: "0 0 200 120"
- Intrinsic aspect ratio: 5:3 (1.667:1)
- Designed to be 200px × 120px

**Next.js Image Component:**
- width={200} height={120} ← Fixed dimensions
- className="h-10 w-auto" ← Forces 40px height, width auto

**Conflict:**
The explicit width/height props combined with Tailwind's height constraint can cause:
- Improper scaling
- Potential distortion if browser calculates width incorrectly
- Layout shift during loading

---

## Solutions

### Solution A: Icon-Only Logo (Recommended)

Create a separate icon-only SVG and use React for text styling.

#### Step 1: Create Icon-Only SVG

Create `/public/images/synura-icon.svg`:

```svg
<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(35, 35)">
    <!-- Outer gear teeth -->
    <path d="M -15,-20 L -12,-25 L 12,-25 L 15,-20 L 20,-15 L 25,-12 L 25,12 L 20,15 L 15,20 L 12,25 L -12,25 L -15,20 L -20,15 L -25,12 L -25,-12 L -20,-15 Z"
          fill="none" stroke="#0A2342" stroke-width="2"/>

    <!-- Inner circle -->
    <circle cx="0" cy="0" r="12" fill="none" stroke="#0A2342" stroke-width="2"/>

    <!-- Circuit connections -->
    <line x1="12" y1="0" x2="35" y2="0" stroke="#0A2342" stroke-width="2"/>
    <circle cx="35" cy="0" r="3" fill="#0A2342"/>

    <line x1="-6" y1="10" x2="-20" y2="25" stroke="#0A2342" stroke-width="2"/>
    <circle cx="-20" cy="25" r="3" fill="#0A2342"/>

    <line x1="6" y1="-10" x2="20" y2="-25" stroke="#0A2342" stroke-width="2"/>
    <circle cx="20" cy="-25" r="3" fill="#0A2342"/>

    <line x1="-10" y1="-6" x2="-30" y2="-15" stroke="#0A2342" stroke-width="2"/>
    <circle cx="-30" cy="-15" r="3" fill="#0A2342"/>

    <line x1="8" y1="8" x2="25" y2="20" stroke="#0A2342" stroke-width="2"/>
    <circle cx="25" cy="20" r="3" fill="#0A2342"/>
  </g>
</svg>
```

#### Step 2: Update Header Component

```tsx
<div className="flex items-center">
  <Link href="/" className="flex items-center gap-3">
    <Image
      src="/images/synura-icon.svg"
      alt="Synura AI Solutions"
      width={40}
      height={40}
      className="w-10 h-10"
      priority
    />
    <div className="flex flex-col">
      <span className="text-xl font-bold text-secondary-900">Synura</span>
      <span className="text-xs text-secondary-600 -mt-1 tracking-wide">AI Solutions</span>
    </div>
  </Link>
</div>
```

**Benefits:**
- ✅ Clean separation of icon and text
- ✅ Full control over text styling
- ✅ No aspect ratio issues
- ✅ Easier to make responsive
- ✅ Better accessibility
- ✅ Consistent branding

---

### Solution B: Full Logo Only (Alternative)

Use the complete logo SVG without additional text.

#### Step 1: Update Header Component

```tsx
<div className="flex items-center">
  <Link href="/" className="flex items-center">
    <Image
      src="/images/synura-logo.svg"
      alt="Synura AI Solutions"
      width={180}
      height={108}
      className="h-12 w-auto"
      priority
    />
  </Link>
</div>
```

**Benefits:**
- ✅ Simpler implementation
- ✅ Uses existing logo file
- ✅ No text duplication

**Drawbacks:**
- ⚠️ Less flexible for responsive design
- ⚠️ Can't easily adjust text color for dark mode
- ⚠️ Fixed typography from SVG

---

### Solution C: Fix Aspect Ratio (Minimal Change)

Keep current setup but fix the aspect ratio issue.

```tsx
<div className="flex items-center">
  <Link href="/" className="flex items-center space-x-3">
    <div className="relative h-10" style={{ aspectRatio: '5/3' }}>
      <Image
        src="/images/synura-logo.svg"
        alt="Synura AI"
        fill
        className="object-contain"
        priority
      />
    </div>
    {/* Remove duplicate text components */}
  </Link>
</div>
```

---

## Recommended Solution: Solution A (Icon-Only)

### Why This Is Best

1. **Professional Appearance:** Clean, modern layout
2. **Flexibility:** Easy to adjust text styling and spacing
3. **Responsive:** Can hide text on mobile if needed
4. **Accessibility:** Better semantic HTML structure
5. **Performance:** Smaller icon-only SVG file
6. **Maintainability:** Easier to update text or styling

### Implementation Steps

1. **Create icon-only SVG file**
2. **Update header.tsx component**
3. **Test responsive behavior**
4. **Verify on different screen sizes**
5. **Check accessibility with screen readers**

---

## Mobile Considerations

### Desktop View (≥768px)
```
┌────────────────────────────────┐
│ [Icon] Synura     Services ... │
│        AI Solutions             │
└────────────────────────────────┘
```

### Mobile View (<768px)
```
┌─────────────────┐
│ [Icon] Synura   │
│        AI Solutions
└─────────────────┘
```

Or simplified:
```
┌──────────┐
│ [Icon]   │
└──────────┘
```

### Responsive Code

```tsx
<Link href="/" className="flex items-center gap-2 md:gap-3">
  <Image
    src="/images/synura-icon.svg"
    alt="Synura AI Solutions"
    width={40}
    height={40}
    className="w-8 h-8 md:w-10 md:h-10"
    priority
  />
  <div className="flex flex-col">
    <span className="text-lg md:text-xl font-bold text-secondary-900">
      Synura
    </span>
    <span className="text-[10px] md:text-xs text-secondary-600 -mt-1 tracking-wide">
      AI Solutions
    </span>
  </div>
</Link>
```

---

## Testing Checklist

After implementing the fix:

- [ ] Logo displays correctly on desktop (1920px, 1440px, 1024px)
- [ ] Logo displays correctly on tablet (768px)
- [ ] Logo displays correctly on mobile (375px, 414px)
- [ ] No aspect ratio distortion
- [ ] No duplicate text
- [ ] Text is readable and properly spaced
- [ ] Icon is crisp and not pixelated
- [ ] Logo is clickable and links to home
- [ ] Alt text is appropriate for screen readers
- [ ] Logo has proper priority loading (no layout shift)
- [ ] Colors match brand guidelines
- [ ] Font weights and sizes are correct

---

## Color Variations

Consider creating different logo versions for different contexts:

### Light Mode (Current)
- Icon color: #0A2342 (dark blue)
- Text color: Secondary-900 (#0f172a)

### Dark Mode (Future)
- Use `/images/synura-logo-white.svg` (already exists)
- Or create white icon version

### Header on Gradient Backgrounds
- White logo version for dark gradient CTAs
- Ensure sufficient contrast

---

## Brand Guidelines

Document the official logo usage:

### Minimum Size
- Desktop: 40px height
- Mobile: 32px height
- Never smaller than 24px

### Clear Space
- Minimum 8px padding around logo
- Keep 12px gap between icon and text

### Color Usage
- Primary: Dark blue (#0A2342)
- On white backgrounds only
- Use white version on colored/dark backgrounds

### Don'ts
- Don't distort or stretch
- Don't rotate the logo
- Don't change colors except approved variations
- Don't add effects (shadows, gradients)
- Don't place on busy backgrounds

---

## Implementation Code (Complete)

Here's the complete, production-ready code:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/common/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'About', href: '/about' },
  { name: 'FAQs', href: '/faqs' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="synura-container flex items-center justify-between py-4">
        {/* Logo - FIXED VERSION */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <Image
              src="/images/synura-icon.svg"
              alt="Synura AI Solutions"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-105"
              priority
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                Synura
              </span>
              <span className="text-[10px] md:text-xs text-secondary-600 -mt-1 tracking-wide uppercase">
                AI Solutions
              </span>
            </div>
          </Link>
        </div>

        {/* Rest of the header remains the same... */}
      </nav>
    </header>
  )
}
```

---

## Next Steps

1. Create the icon-only SVG file
2. Update the header component
3. Test on local development server
4. Verify responsive behavior
5. Commit with message: "Fix logo distortion and remove duplicate text"
6. Deploy and verify on production

**Estimated time:** 15-20 minutes
**Risk level:** Low (isolated change)
**Impact:** High (much cleaner professional appearance)
