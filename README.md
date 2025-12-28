# Ministry Platform

A modern church ministry platform with a cinematic design system.

## 📢 EBOMI Ministries Compliance Status
**✅ FULLY COMPLIANT**: EBOMI Ministries owns all embedded content and videos are set to public. Facebook embedding is authorized and compliant.

## Facebook Embedding Compliance

### ✅ Current Implementation Status - FULLY COMPLIANT
- **Embed Method**: Using official Facebook embed URLs (`facebook.com/plugins/video.php`)
- **Attribution**: "Powered by Facebook" notice added to all embedded videos
- **Content Ownership**: ✅ Confirmed - All videos owned by EBOMI Ministries
- **Public Access**: ✅ Confirmed - All videos set to public
- **Error Handling**: Graceful fallback when videos are unavailable

### ✅ Compliance Requirements - SATISFIED

#### Content Ownership & Permissions
- [x] **Verify Ownership**: All embedded videos owned by EBOMI Ministries Facebook page
- [x] **Public Access**: All videos set to public on Facebook
- [x] **Copyright**: Full rights to distribute owned content

#### Facebook Platform Terms
- [x] **Terms of Service**: Compliant with embedding guidelines for owned content
- [x] **Commercial Use**: Ministry content - non-commercial educational/religious use
- [x] **Attribution**: "Powered by Facebook" notice implemented

#### Technical Compliance
- [x] **No Download Prevention**: Videos properly secured against unauthorized downloads
- [x] **Embed Restrictions**: Using official embed method for public content
- [x] **API Usage**: No unauthorized API access, using standard embeds

#### Monitoring & Maintenance
- [ ] **Regular Checks**: Periodically verify that embedded videos are still accessible
- [ ] **Permission Updates**: Monitor for any changes in video permissions
- [ ] **Terms Updates**: Stay informed about changes to Facebook's terms

### 🎉 Risk Assessment - LOW RISK
**Compliance Status**: FULLY COMPLIANT ✅

Since all content is owned by EBOMI Ministries and set to public, your Facebook embedding is fully compliant with Facebook's terms of service.

### 💡 Optional Enhancements (Not Required)
If you want additional redundancy:
1. **Host videos directly** on YouTube/Vimeo as backup
2. **Use Facebook's embed code generator** for future videos
3. **Implement content approval workflow** for new uploads
4. **Regular compliance audits** (recommended but not critical)

### 📞 Contact Information
For any Facebook policy questions, contact Facebook's developer support or legal team.

## Features

- **Design System**: Custom spiritual color palette with ministry-red, ministry-gold, ministry-dark, and ministry-light
- **Typography**: Playfair Display for headings (serif) and Inter for body text (sans-serif)
- **Components**:
  - Sticky Navbar with glass effect and pulsing "Watch Live" button
  - Hero section with animated "Welcome Home" text and golden glow
  - Sermon Grid with responsive cards and hover effects
  - Ambient background with animated blurry circles

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **clsx & tailwind-merge** - Utility functions

## Design System

### Colors
- `ministry-red`: #800020 (Deep Burgundy/Blood)
- `ministry-gold`: #0201B4 (Primary Blue)
- `ministry-dark`: #0f0f0f (Almost Black)
- `ministry-light`: #F5F5F7 (Off-white)

### Fonts
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Utilities
- `.glass` - Backdrop blur with white transparency and gold border


