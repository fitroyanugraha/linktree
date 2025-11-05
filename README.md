# Linktree - Personal Linktree Web App

A personal Linktree-style web application built with React and Vite, featuring social media links and an anonymous contact form with rate limiting.

## Overview

This project is a personal linktree for Fitroya Nugraha, showcasing social media profiles and providing a way for visitors to send anonymous messages. The app includes:

- **Header**: Profile image and name display
- **Navigation**: Social media links with mobile app deep linking
- **Contact Form**: Anonymous message submission with daily rate limiting
- **Responsive Design**: Mobile-friendly interface

## Technologies Used

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: CSS with Poppins font from Google Fonts
- **Icons**: Boxicons for social media icons
- **Alerts**: SweetAlert2 for user notifications
- **Security**: DOMPurify for input sanitization
- **API**: SheetDB for backend data storage
- **Development**: ESLint for code linting

## Project Structure

```
linktree/
├── public/                   # Static assets
│   ├── favicon/
│   │   ├── star.svg          # ⭐ Main favicon (all-in-one SVG)
│   │   └── site.webmanifest  # PWA manifest configuration
│   ├── robots.txt            # SEO: Search engine crawl rules
│   └── sitemap.xml           # SEO: Site structure map
│
├── src/                      # Application source code
│   ├── assets/
│   │   └── Photo-Profile.jpeg   # User profile picture
│   ├── components/
│   │   ├── ContactForm.jsx      # Anonymous message form with rate limiting
│   │   ├── Header.jsx           # Profile header component
│   │   └── NavButtons.jsx       # Social media links navigation
│   ├── data/
│   │   └── navLinks.js          # Social links configuration & deep linking
│   ├── App.jsx                  # Main React component
│   ├── main.jsx                 # React entry point & DOM render
│   └── style.css                # Global styles & CSS variables
│
├── .env                      # Environment variables (gitignored)
├── .gitignore                # Git ignore rules
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point with SEO meta tags
├── package.json              # Dependencies & npm scripts
├── package-lock.json         # Locked dependency versions
├── vite.config.js            # Vite build configuration
├── LICENSE                   # MIT License
└── README.md                 # Project documentation
```

## Key Features

### Social Media Navigation
- Instagram, TikTok, LinkedIn, and Portfolio links
- Mobile app deep linking for Android and iOS
- Fallback to web URLs for desktop

### Anonymous Contact Form
- Text area for message input (max 115 characters)
- Input validation (minimum 20 characters)
- Daily rate limiting (configurable via environment variables)
- Message sanitization (removes HTML tags and scripts)
- Success/error notifications via SweetAlert2

### Rate Limiting
- Daily message limit stored in localStorage
- Alert shown only once per day when limit is reached
- Form disabled when limit exceeded
- Automatic reset on new day

### Responsive Design
- Mobile-first approach
- Scroll prevention when form is focused
- Smooth animations and transitions

### PWA (Progressive Web App)
- Installable on mobile devices
- Offline-ready with service worker support

### SEO Optimization
- Comprehensive meta tags (title, description, keywords)
- Open Graph tags for social media sharing (Facebook, WhatsApp, LinkedIn)
- Twitter Card tags for Twitter sharing
- Structured Data (JSON-LD) with Schema.org Person markup
- robots.txt for search engine crawlers
- sitemap.xml for better indexing
- Canonical URL to prevent duplicate content
- Rich snippets support for Google search results

## Environment Variables

The following environment variables can be configured:

- `VITE_BEARER_TOKEN`: API authorization token
- `VITE_API_URL`: Backend API endpoint for message submission
- `VITE_MAX_MESSAGES_PER_DAY`: Maximum messages allowed per day (default: configured in code)

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd linktree
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env`:
   ```
   VITE_BEARER_TOKEN=your_sheetdb_api_token
   VITE_API_URL=https://sheetdb.io/api/v1/your_sheet_id
   VITE_MAX_MESSAGES_PER_DAY=2
   ```
   ⚠️ **NEVER commit the `.env` file to Git!**

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Preview production build**:
   ```bash
   npm run preview
   ```

## Code Explanation

### App.jsx
The main component that orchestrates the application:
- Manages state for form visibility and success message
- Renders Header, NavButtons, and ContactForm components
- Handles message sent callback to show success message

### Header.jsx
Displays the profile image and name:
- Uses imported image asset
- Simple centered layout

### NavButtons.jsx
Renders social media navigation buttons:
- Maps over navLinks data to create buttons
- Each button has an icon and label
- Click handlers redirect to appropriate URLs or apps

### navLinks.js
Configuration for social media links:
- Detects device type (Android/iOS/Desktop)
- Uses app intents for mobile deep linking
- Fallback URLs for web browsers

### ContactForm.jsx
The core contact form component:
- **State Management**: Tracks message, focus, loading, and rate limit status
- **Rate Limiting**: Checks and updates daily message count in localStorage
- **Validation**: Ensures message is not empty and meets minimum length
- **API Integration**: Sends POST request to configured API endpoint
- **User Experience**: Shows loading state, success/error alerts, prevents space bar confirmation

### style.css
Global styles including:
- CSS custom properties for colors
- Responsive layout with flexbox
- Button animations and hover effects
- Form styling with transitions
- Scrollbar hiding for mobile experience

## API Integration

The contact form sends messages to a backend API with the following payload:

```json
{
  "data": {
    "tanggal": "Senin, 1 Januari 2024",
    "waktu": "14:30",
    "message": "Sanitized message content"
  }
}
```

Headers include:
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

## Security Features

This application implements multiple layers of security:

### Input Protection
- **DOMPurify Sanitization**: Advanced XSS protection with zero HTML tags allowed
- **Input Validation**: Minimum/maximum length checks
- **Rate Limiting**: Daily message limits (configurable via environment variables)

### HTTP Security Headers
- **Content Security Policy (CSP)**: Restricts resource loading to trusted sources
- **Subresource Integrity (SRI)**: Verifies CDN resources integrity
- **X-Frame-Options**: DENY - Prevents clickjacking attacks
- **X-Content-Type-Options**: nosniff - Prevents MIME type sniffing
- **X-XSS-Protection**: Enabled with blocking mode
- **Strict-Transport-Security**: Enforces HTTPS connections
- **Referrer-Policy**: Controls referrer information leakage

### Data Protection
- **Environment Variables**: Sensitive credentials stored in `.env` (gitignored)
- **Production Logging**: Console logs disabled in production builds
- **No Direct Database Access**: All API calls go through SheetDB backend

### Configuration Files
- `netlify.toml` - Netlify deployment with security headers
- `vercel.json` - Vercel deployment with security headers
- `public/_headers` - Additional header configuration
- `.env.example` - Template for environment variables


## SEO & Performance

### Search Engine Optimization
This web app is fully optimized for search engines with:
- **Meta Tags**: Complete primary, Open Graph, and Twitter Card tags
- **Structured Data**: JSON-LD schema for Person entity
- **robots.txt**: Allows all search engines to crawl
- **sitemap.xml**: Helps search engines discover and index pages
- **Canonical URL**: Prevents duplicate content issues
- **Rich Snippets**: Schema.org markup for enhanced search results


## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers with app deep linking
- Responsive design works on all screen sizes
- PWA support on Chrome, Edge, Safari (iOS 11.3+)

## Development Notes

- Uses Vite for fast development and optimized builds
- ESLint for code quality
- Boxicons for consistent iconography
- SweetAlert2 for accessible modal dialogs

## License

This project is licensed under the terms specified in the LICENSE file.
