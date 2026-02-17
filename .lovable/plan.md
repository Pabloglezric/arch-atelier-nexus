

# Fix Custom Domain SSL + Full SEO/GEO Optimization

## Part 1: Custom Domain (3points.life) SSL Fix

The error you're seeing ("ERR_SSL_VERSION_OR_CIPHER_MISMATCH") means the SSL certificate hasn't been provisioned for your domain yet. This is a DNS/hosting configuration issue, not a code issue.

**What you need to do (outside of Lovable):**

1. Go to your Lovable project **Settings > Domains**
2. Click **Connect Domain** and enter `3points.life`
3. At your domain registrar (wherever you bought 3points.life), set these DNS records:
   - **A Record**: Name: `@` -> Value: `185.158.133.1`
   - **A Record**: Name: `www` -> Value: `185.158.133.1`
   - **TXT Record**: Name: `_lovable` -> Value: (Lovable will provide this during setup)
4. Wait for DNS propagation (up to 72 hours) -- Lovable will automatically provision the SSL certificate
5. Add both `3points.life` and `www.3points.life` in Lovable, set one as Primary

If you already set this up, check with a tool like [DNSChecker.org](https://dnschecker.org) that your A records point to `185.158.133.1` and there are no conflicting records.

---

## Part 2: Comprehensive SEO/GEO Optimization

I will implement the following across every page of the site:

### A. Create an SEO Head Component
A reusable `<SEOHead>` component using `react-helmet-async` that dynamically sets per-page:
- `<title>` with targeted keywords
- `<meta name="description">` unique per page
- `<meta name="keywords">` relevant to each page
- Open Graph tags (og:title, og:description, og:url, og:image, og:type)
- Twitter Card tags
- Canonical URL (`<link rel="canonical">`)
- `<meta name="robots" content="index, follow">`
- Schema.org structured data (JSON-LD) for Person, Organization, and WebPage

### B. Page-Specific SEO Metadata

| Page | Title | Focus Keywords |
|------|-------|----------------|
| Home `/` | Juan Pablo Gonzalez Ricardez - BIM Specialist & Architectural Technologist, Leeds | BIM specialist Leeds, architectural technologist |
| Portfolio `/portfolio` | Portfolio - BIM Projects & Architectural Documentation | BIM portfolio, Revit models, LOD400 |
| About `/about` | About - Architectural Technologist & BIM Consultant | architectural technologist UK, BIM consultant |
| Contact `/contact` | Contact - Hire a BIM Specialist | hire BIM specialist, architectural services |
| Interactive Models `/interactive-models` | Interactive 3D Models - Parametric Design | 3D BIM models, parametric design |

### C. Structured Data (JSON-LD)
Add Schema.org markup for:
- **Person** schema (name, jobTitle, url, sameAs for LinkedIn)
- **ProfessionalService** schema (services offered, location)
- **WebSite** schema with search action potential

### D. Update robots.txt
Add a sitemap reference and explicit ChatGPT/AI bot permissions:

```text
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://3points.life/sitemap.xml
```

### E. Create sitemap.xml
A static `public/sitemap.xml` listing all pages with priorities and change frequencies.

### F. Update index.html
- Fix the `og:image` and `twitter:image` to use proper site branding
- Add `<meta name="robots">` tag
- Update author meta to "Juan Pablo Gonzalez Ricardez"
- Add geo meta tags (geo.region, geo.placename)

### G. Semantic HTML Improvements
- Ensure proper heading hierarchy (h1 > h2 > h3) on every page
- Add `alt` text to all images with descriptive, keyword-rich content
- Add `aria-label` attributes for accessibility and crawlability

---

## Technical Details

### New files:
- `src/components/SEOHead.tsx` - Reusable SEO component with react-helmet-async
- `public/sitemap.xml` - XML sitemap for all pages

### Modified files:
- `index.html` - Updated meta tags, geo tags, author
- `public/robots.txt` - AI bot permissions + sitemap reference
- `src/main.tsx` - Wrap app with HelmetProvider
- `src/pages/Index.tsx` - Add SEOHead + JSON-LD
- `src/pages/Portfolio.tsx` - Add SEOHead + JSON-LD
- `src/pages/About.tsx` - Add SEOHead + JSON-LD
- `src/pages/Contact.tsx` - Add SEOHead + JSON-LD
- `src/pages/InteractiveModels.tsx` - Add SEOHead + JSON-LD
- `src/pages/NotFound.tsx` - Add noindex meta

### New dependency:
- `react-helmet-async` - for dynamic document head management

