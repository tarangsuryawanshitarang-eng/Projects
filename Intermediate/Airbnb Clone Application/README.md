# Airbnb Clone

A production-quality Airbnb Home Page Clone built with React that recreates the core Airbnb experience. This project features a sticky navbar with expandable search, scrollable category filters, listing cards with image carousels, a listing detail page with maps, authentication modals, and fully responsive design. Uses mock data with simulated API delays — no real backend needed.

![Airbnb Clone Screenshot](https://via.placeholder.com/1200x600/FF385C/FFFFFF?text=Airbnb+Clone)

## 🚀 Tech Stack

| Technology                  | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| **React 18 + Vite**         | UI framework + lightning-fast build tool |
| **React Router v6**         | Client-side routing                      |
| **Tailwind CSS**            | Utility-first styling                    |
| **Zustand**                 | Lightweight global state management      |
| **Swiper.js**               | Touch-friendly image carousels           |
| **Framer Motion**           | Smooth animations and transitions        |
| **React Icons**             | Comprehensive icon library               |
| **Leaflet + React Leaflet** | Interactive maps                         |
| **date-fns**                | Date utilities                           |

## 📋 Features

### Home Page

- ✅ Sticky navbar with scroll shadow effect
- ✅ Expandable search bar with destination, dates, and guest inputs
- ✅ User menu dropdown with auth options
- ✅ Horizontally scrollable category bar (25 categories)
- ✅ Responsive listing grid (1-4 columns based on viewport)
- ✅ Listing cards with Swiper image carousels
- ✅ Wishlist heart toggle with auth check
- ✅ Guest favorite badges
- ✅ Filter modal with type, price, bedrooms, and amenities
- ✅ Skeleton loading states with shimmer animation
- ✅ "Show more" pagination

### Listing Detail Page

- ✅ Photo grid (1 large + 4 small) with full-screen gallery modal
- ✅ Sticky booking card with price calculator
- ✅ Host information with Superhost badge
- ✅ Expandable description with "Show more/less"
- ✅ Amenities grid with modal for all amenities
- ✅ Review section with rating breakdown bars
- ✅ Interactive Leaflet map with location marker
- ✅ Mobile bottom bar for reservations

### Authentication

- ✅ Login/Signup modals with toggle
- ✅ Form validation (email format, password length)
- ✅ Social login buttons (UI only)
- ✅ Toast notifications on login success

### Global Features

- ✅ Toast notification system (success, error, info)
- ✅ 404 Not Found page
- ✅ Wishlist persistence (localStorage)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth Framer Motion animations

## 🛠️ Setup Instructions

```bash
# Clone the repository
git clone <repo-url>
cd airbnb-clone

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

## 📁 Project Structure

```
airbnb-clone/
├── src/
│   ├── main.jsx                 # App entry point
│   ├── App.jsx                  # Root component with routing
│   ├── index.css                # Global styles + Tailwind
│   │
│   ├── components/
│   │   ├── navbar/              # Navbar, SearchBar, GuestCounter, UserMenu
│   │   ├── home/                # CategoryBar, ListingGrid, ListingCard, etc.
│   │   ├── listing/             # PhotoGrid, BookingCard, ReviewSection, etc.
│   │   ├── modals/              # AuthModal, FilterModal
│   │   └── ui/                  # Modal, Toast, Skeleton, Footer
│   │
│   ├── pages/
│   │   ├── HomePage.jsx         # Main listing grid page
│   │   ├── ListingPage.jsx      # Individual listing detail
│   │   └── NotFoundPage.jsx     # 404 page
│   │
│   ├── store/
│   │   ├── useAuthStore.js      # Authentication state
│   │   ├── useFilterStore.js    # Search & filter state
│   │   ├── useWishlistStore.js  # Wishlist with persistence
│   │   └── useToastStore.js     # Toast notifications
│   │
│   ├── data/
│   │   ├── listings.js          # 15 mock listings
│   │   └── categories.js        # 25 categories
│   │
│   ├── services/
│   │   └── api.js               # Simulated async API
│   │
│   └── hooks/
│       ├── useClickOutside.js   # Click outside detection
│       └── useScrollPosition.js # Scroll tracking
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Color Palette (Matches Airbnb)

```css
--airbnb-primary: #ff385c /* Brand red */ --airbnb-primary-dark: #e31c5f
  /* Hover state */ --text-primary: #222222 /* Headings, body */
  --text-secondary: #717171 /* Secondary text */ --border: #dddddd
  /* Borders, dividers */ --background: #ffffff /* Page background */
  --background-gray: #f7f7f7 /* Section backgrounds */;
```

## 📱 Responsive Breakpoints

| Breakpoint | Layout Changes                                       |
| ---------- | ---------------------------------------------------- |
| ≥1280px    | 4-column listing grid, full navbar                   |
| ≥1024px    | 3-column grid                                        |
| ≥768px     | 2-column grid, compact mobile search                 |
| <768px     | 1-column grid, mobile bottom bar, full-screen modals |

## 🧪 Routes

| Route        | Page                    |
| ------------ | ----------------------- |
| `/`          | Home page with listings |
| `/rooms/:id` | Listing detail page     |
| `*`          | 404 Not Found           |

## 📝 License

This is a frontend clone for educational purposes. No real bookings or payments are processed. Not affiliated with Airbnb, Inc.

---

Built with ❤️ using React + Vite
