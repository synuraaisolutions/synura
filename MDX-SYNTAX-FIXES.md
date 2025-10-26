# MDX Syntax Error Fixes - Detailed Analysis

**Date:** October 25, 2025
**Issue:** All service detail pages failing to build with "Invalid or unexpected token" error

---

## Root Cause Identified

All four MDX service files contain **HTML entities** (`&amp;`) in their headings and text. MDX parsers can be sensitive to these entities, especially in headings, which is causing the build failures.

---

## Files Affected and Specific Issues

### 1. `/content/services/ai-consulting.mdx`

**Line 23:** `# AI Consulting &amp; Strategy Services`
**Line 60:** `### Strategy Package (4-8 weeks)` - Contains `&amp;` in section description

**Problematic Text Sections:**
- "AI Consulting &amp; Strategy Services" (line 23)
- All mentions of "& Strategy" throughout the file

---

### 2. `/content/services/automation-integration.mdx`

**Line 23:** `# Automation &amp; Integration Services`
**Line 60:** `4. **Testing &amp; Validation**: ...` (line 60)

**Problematic Text Sections:**
- "Automation &amp; Integration Services" (line 23)
- "Testing &amp; Validation" (line 60)
- "Monitoring &amp; Optimization" (line 61)

---

### 3. `/content/services/managed-operations.mdx`

**Line 31:** `### 24/7 Monitoring &amp; Support`
**Line 50:** `- **Backup &amp; Recovery**: ...`
**Line 85:** `## Reporting &amp; Analytics`

**Problematic Text Sections:**
- "24/7 Monitoring &amp; Support" (line 31)
- "Backup &amp; Recovery" (line 50)
- "Reporting &amp; Analytics" (line 85)

---

### 4. `/content/services/ai-workforce.mdx`

This file appears clean in the sections reviewed, but should be checked for consistency.

---

## Why This Causes Build Failures

MDX is a mix of Markdown and JSX. When the MDX parser encounters `&amp;` in the content:

1. **In Markdown text:** Usually OK, gets converted to `&`
2. **In headings:** Can cause parsing issues as the parser tries to interpret it as JSX
3. **In list items with bold text:** Can conflict with JSX component rendering

The error "Invalid or unexpected token" suggests the MDX-to-JavaScript compilation is failing when it encounters these HTML entities in specific contexts (likely headings and list items).

---

## Solution: Replace HTML Entities with Plain Characters

### Simple Fix

Replace all instances of `&amp;` with just `&` in all MDX files.

**Why this works:**
- Markdown/MDX automatically escapes `&` when needed
- Plain `&` is safer and more readable in MDX content
- No need for HTML entity encoding in MDX files

---

## Detailed Fix Instructions

### File 1: `/content/services/ai-consulting.mdx`

**Changes needed:**

Line 23:
```diff
- # AI Consulting &amp; Strategy Services
+ # AI Consulting & Strategy Services
```

Search and replace throughout file:
- `&amp;` → `&`

---

### File 2: `/content/services/automation-integration.mdx`

**Changes needed:**

Line 23:
```diff
- # Automation &amp; Integration Services
+ # Automation & Integration Services
```

Line 60:
```diff
- 4. **Testing &amp; Validation**: Ensure accuracy and reliability of automated processes
+ 4. **Testing & Validation**: Ensure accuracy and reliability of automated processes
```

Line 61:
```diff
- 5. **Monitoring &amp; Optimization**: Ongoing performance tracking and improvements
+ 5. **Monitoring & Optimization**: Ongoing performance tracking and improvements
```

---

### File 3: `/content/services/managed-operations.mdx`

**Changes needed:**

Line 31:
```diff
- ### 24/7 Monitoring &amp; Support
+ ### 24/7 Monitoring & Support
```

Line 50:
```diff
- - **Backup &amp; Recovery**: Comprehensive data protection and disaster recovery
+ - **Backup & Recovery**: Comprehensive data protection and disaster recovery
```

Line 85:
```diff
- ## Reporting &amp; Analytics
+ ## Reporting & Analytics
```

---

## Additional Checks

### Other Potential MDX Issues

While reviewing the files, also check for:

1. **Curly quotes:** Replace `"` and `"` with straight quotes `"`
2. **Em-dashes:** Replace `—` with `--` or `-`
3. **Special Unicode characters:** Can cause encoding issues
4. **Unclosed JSX tags:** If using components in MDX
5. **Invalid frontmatter:** YAML syntax errors in the `---` section

---

## Testing Procedure

After making the fixes:

1. **Rebuild contentlayer cache:**
   ```bash
   cd /Users/collinmclaughlin/Synurawebsite
   rm -rf .contentlayer
   npm run content:build
   ```

2. **Run local build:**
   ```bash
   npm run build
   ```

3. **Check for errors:**
   - Build should complete without "Invalid or unexpected token" errors
   - All 4 service pages should prerender successfully
   - Look for the success message: `✓ Generating static pages (23/23)`

4. **Test locally:**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000/services
   - Click each service to verify detail pages load
   - Check that MDX content renders correctly

5. **Deploy to Vercel:**
   ```bash
   git add .
   git commit -m "Fix MDX syntax errors in service pages"
   git push
   ```

---

## Quick Fix Commands

Run these commands to fix all files at once:

```bash
cd /Users/collinmclaughlin/Synurawebsite/content/services

# Create backup
cp ai-consulting.mdx ai-consulting.mdx.backup
cp automation-integration.mdx automation-integration.mdx.backup
cp managed-operations.mdx managed-operations.mdx.backup

# Fix files (macOS/Linux)
sed -i '' 's/&amp;/\&/g' ai-consulting.mdx
sed -i '' 's/&amp;/\&/g' automation-integration.mdx
sed -i '' 's/&amp;/\&/g' managed-operations.mdx
sed -i '' 's/&amp;/\&/g' ai-workforce.mdx
```

Or manually edit each file and replace `&amp;` with `&`.

---

## Expected Outcome

After applying these fixes:

✅ All service pages should build successfully
✅ No "Invalid or unexpected token" errors
✅ Service detail pages (/services/ai-consulting, etc.) should load properly
✅ MDX content should render with proper formatting
✅ Vercel deployment should complete without errors

---

## Verification Checklist

- [ ] Replaced all `&amp;` with `&` in ai-consulting.mdx
- [ ] Replaced all `&amp;` with `&` in automation-integration.mdx
- [ ] Replaced all `&amp;` with `&` in managed-operations.mdx
- [ ] Checked ai-workforce.mdx for any HTML entities
- [ ] Cleared .contentlayer cache
- [ ] Ran `npm run build` successfully
- [ ] Tested all service pages locally
- [ ] Verified MDX content renders correctly
- [ ] Committed changes with clear message
- [ ] Pushed to Vercel and verified deployment
- [ ] Tested live site after deployment

---

## Why This Happened

The HTML entities (`&amp;`) were likely introduced by:

1. **Copy-pasting from a rich text editor** (Word, Google Docs, etc.)
2. **HTML content conversion** tools that auto-encode ampersands
3. **Over-escaping** by a previous editing tool

**Best Practice:** Always use plain text characters in MDX files. The MDX/React renderer will handle proper escaping automatically.

---

## Prevention for Future Content

### Writing Guidelines for MDX Files

1. ✅ **Use plain text characters:** `&`, not `&amp;`
2. ✅ **Use straight quotes:** `"` not `"` or `"`
3. ✅ **Use regular dashes:** `-` or `--` not `—`
4. ✅ **Write in plain text editor** or MDX-aware editor
5. ✅ **Test builds locally** before pushing

### Recommended MDX Editors

- **VS Code** with MDX extension
- **Cursor** (already setup for this project)
- **Obsidian** with MDX support
- Any editor with Prettier + MDX formatting

---

## Summary

The build failures are caused by HTML entity encoding (`&amp;`) in MDX heading and list content. Simply replacing these with plain ampersands (`&`) will resolve all build errors and allow the service pages to render correctly.

**Time to fix:** 5-10 minutes
**Risk level:** Very low (simple find/replace)
**Impact:** High (unblocks all service pages)
