import { Product, StoreSettings } from './types';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: "Luqman Fabrics",
  tagline: "Quality You Feel, Style You Love",
  whatsappNumber: "923409797271",
  displayWhatsApp: "+92 340 9797271",
  email: "luqmanfabricsshewa@gmail.com",
  location: "Shewa, Khyber Pakhtunkhwa, Pakistan",
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  announcementText: "✨ FREE  Delivery on orders over Rs. 5,000",
  showAnnouncement: true,
  bankDetails: {
    bankName: "Meezan Bank / HBL / EasyPaisa / JazzCash",
    accountTitle: "Luqman Fabrics",
    accountNumber: "0340-9797271",
    iban: "PK78MEZN0000000123456789",
  },
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Aurelia Royal Gold Embroidered Swiss Lawn (3-Piece)",
    slug: "aurelia-royal-gold-embroidered-swiss-lawn-3pc",
    sku: "LF-LWN-001",
    price: 6850,
    originalPrice: 8500,
    category: "women-unstitched",
    fabricType: "Superfine 90/88 Swiss Lawn with Organza Cutwork",
    cutLength: "3-Piece Unstitched (Shirt 3m, Trouser 2.5m, Dupatta 2.5m)",
    pieces: "3-Piece",
    description: "Handcrafted luxury lawn embellished with shimmering tilla and resham floral thread embroidery on the neckline, borders, and sleeves. Paired with a delicate embroidered organza dupatta and pure cambric dyed trousers.",
    details: [
      "Embroidered Swiss Lawn Front & Neckline Panel (1.25m)",
      "Digital Printed Swiss Lawn Back & Sleeves (1.75m)",
      "Heavy Embroidered Silk Chiffon Dupatta with 4-side borders (2.5m)",
      "Premium Dyed Pure Cambric Cotton Trouser (2.5m)",
      "Includes extra embroidered organza border patch for daman and sleeves"
    ],
    features: {
      weave: "High-density 90/88 Airjet Compact Weave",
      season: "Summer",
      transparency: "Non-Transparent",
      softness: "Silky Smooth",
      shrinkage: "Pre-shrunk (Zero color bleeding guarantee)"
    },
    colors: [
      { name: "Pearl Ivory & Gold", hex: "#FDFBF7", image: "/images/lawn_luxury.jpg" },
      { name: "Mint Sage Green", hex: "#D4E2D4", image: "/images/hero.jpg" },
      { name: "Blush Rose Quartz", hex: "#F3E1E1", image: "/images/lawn_luxury.jpg" },
    ],
    images: [
      "/images/lawn_luxury.jpg",
      "/images/hero.jpg",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
    ],
    badge: "Bestseller",
    stock: 24,
    inStock: true,
    rating: 4.9,
    reviewCount: 48,
    featured: true,
    createdAt: "2026-03-01T10:00:00Z"
  },
  {
    id: "prod-2",
    name: "Executive Royal Imperial Boski (Men's Unstitched Suit)",
    slug: "executive-royal-imperial-boski-suit",
    sku: "LF-BSK-002",
    price: 7490,
    originalPrice: 9200,
    category: "men-unstitched",
    fabricType: "Original 6-Pound Weight Micro-Fiber Silk Blend Boski",
    cutLength: "Unstitched 4.5 Meters (Generous Men's Suit Cut)",
    pieces: "4.5m Suit",
    description: "The pinnacle of royal elegance for traditional Pakistani menswear. Features the signature heavy fall, lustrous sheen, and cooling comfort of authentic Boski. Comes in a luxury gift presentation box with mother-of-pearl buttons and woven brand collar tags.",
    details: [
      "4.5 Meters Length × 54 Inches Wide Width (Bara Arzz)",
      "Authentic Heavy Fall with non-crushing soft drape",
      "Comes with 8 authentic Natural Shell / Mother-of-Pearl buttons",
      "Includes woven Luqman Fabrics collar and pocket emblem tags",
      "Packaged in an embossed rigid gold-leaf gift box"
    ],
    features: {
      weave: "Superfine Filament Sateen Boski Weave",
      season: "All Seasons",
      transparency: "Opaque",
      softness: "Silky Smooth",
      shrinkage: "Zero shrinkage required (Iron on low-medium heat)"
    },
    colors: [
      { name: "Pure Snow White", hex: "#FFFFFF", image: "/images/mens_boski.jpg" },
      { name: "Heritage Cream Boski (Off-White)", hex: "#FAF5E4", image: "/images/mens_boski.jpg" },
      { name: "Royal Champagne", hex: "#EADCB9", image: "/images/mens_boski.jpg" },
    ],
    images: [
      "/images/mens_boski.jpg",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80",
      "/images/hero.jpg",
    ],
    badge: "Exclusive Luxury",
    stock: 35,
    inStock: true,
    rating: 5.0,
    reviewCount: 64,
    featured: true,
    createdAt: "2026-03-02T10:00:00Z"
  },
  {
    id: "prod-3",
    name: "Sovereign Wash & Wear Wrinkle-Free Tropical Fabric",
    slug: "sovereign-wash-wear-wrinkle-free-men-suit",
    sku: "LF-WW-003",
    price: 3950,
    originalPrice: 4800,
    category: "men-unstitched",
    fabricType: "Japanese Yarn Poly-Viscose Blended Tropical Weave",
    cutLength: "Unstitched 4.0 Meters Large Width (4m Bara Arzz)",
    pieces: "4.5m Suit",
    description: "Engineered for high durability and zero maintenance. This crease-resistant wash-and-wear fabric retains its sharp, pressed look all day even in hot, humid weather. Soft on skin with a graceful graceful drop.",
    details: [
      "4.0 Meters × 56 Inches Width (Standard 4.5m equivalent)",
      "Wrinkle-resistant & easy to iron technology",
      "Breathable moisture-wicking weave for peak comfort",
      "Includes matching branded metal buttons and pocket tag"
    ],
    features: {
      weave: "Tropical Plain Slub Weave",
      season: "Summer",
      transparency: "Non-Transparent",
      softness: "Soft & Crisp",
      shrinkage: "Zero shrinkage guaranteed"
    },
    colors: [
      { name: "Steel Silver Grey", hex: "#D2D6DC", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80" },
      { name: "Midnight Charcoal", hex: "#2B2D42", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80" },
      { name: "Soft Almond Khaki", hex: "#E6D7C3", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80" },
      { name: "Pure Crisp White", hex: "#FAFAFA", image: "/images/mens_boski.jpg" },
    ],
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80",
      "/images/mens_boski.jpg",
    ],
    badge: "Sale",
    stock: 45,
    inStock: true,
    rating: 4.8,
    reviewCount: 39,
    featured: true,
    createdAt: "2026-03-03T10:00:00Z"
  },
  {
    id: "prod-4",
    name: "Noor-e-Zarin Pure Chiffon Embroidered Wedding Formals (3-Piece)",
    slug: "noor-e-zarin-pure-chiffon-embroidered-formals",
    sku: "LF-CHF-004",
    price: 11950,
    originalPrice: 14500,
    category: "chiffon-luxury",
    fabricType: "100% Pure Crinkle Chiffon with Zari & Sequins",
    cutLength: "3-Piece Luxury Unstitched (Shirt, Trousers & Heavy Dupatta)",
    pieces: "3-Piece",
    description: "An ethereal bridal and formal ensemble rendered on pure crinkle chiffon. Rich gold zari motifs, handcrafted sequin work, and scalloped hand-finished borders create a mesmerizing royal silhouette for festive occasions.",
    details: [
      "Pure Chiffon Front with Heavy Zari, Dori & Sequin Embroidery (1.25m)",
      "Pure Chiffon Back with Embroidered Booti Motifs (1.25m)",
      "Embroidered Chiffon Sleeves with Detailed Cuff Borders (0.75m)",
      "Luxury Ready-to-Wear Chiffon Dupatta with 4-side laser-cut embroidery (2.5m)",
      "Pure Raw Silk Trousers with Embroidered Ankle Border (2.5m)",
      "Cotton Silk Slip / Lining Fabric included (2.5m)"
    ],
    features: {
      weave: "Fine Handloom Crinkle Chiffon",
      season: "Festive / Wedding",
      transparency: "Semi-Sheer (Slip Needed)",
      softness: "Silky Smooth",
      shrinkage: "Dry clean recommended"
    },
    colors: [
      { name: "Champagne Gold & Pearl", hex: "#E8DCB8", image: "/images/hero.jpg" },
      { name: "Powder Blue & Silver", hex: "#D6E4F0", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80" },
      { name: "Crimson Maroon", hex: "#800020", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80" }
    ],
    images: [
      "/images/hero.jpg",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
      "/images/lawn_luxury.jpg"
    ],
    badge: "Exclusive Luxury",
    stock: 12,
    inStock: true,
    rating: 5.0,
    reviewCount: 22,
    featured: true,
    createdAt: "2026-03-04T10:00:00Z"
  },
  {
    id: "prod-5",
    name: "Giza 100/2 Egyptian Supima Cotton (Men's Luxury Unstitched)",
    slug: "giza-100-egyptian-supima-cotton-suit",
    sku: "LF-CTN-005",
    price: 5450,
    originalPrice: 6500,
    category: "pure-cotton",
    fabricType: "100% Long-Staple Egyptian Giza Compact Cotton",
    cutLength: "Unstitched 4.5 Meters (Full Suit Cut)",
    pieces: "4.5m Suit",
    description: "Woven from extra-long staple Egyptian Giza cotton yarns with a liquid-ammonia silken finish. Exceptionally soft on skin, breathable during scorching summer days, with a subtle natural luster that elevates traditional Shalwar Kameez.",
    details: [
      "4.5 Meters Unstitched Standard Suit Cut",
      "Mercerized Liquid Ammonia finish for enduring luster",
      "Featherlight, breathable, and hypoallergenic",
      "Includes set of premium buttons and collar/cuff facing canvas"
    ],
    features: {
      weave: "Compact Poplin 100/2 Twill Weave",
      season: "Summer",
      transparency: "Opaque",
      softness: "Ultra Soft / Breathable",
      shrinkage: "Pre-shrunk 100%"
    },
    colors: [
      { name: "Pure Arctic White", hex: "#FFFFFF", image: "/images/mens_boski.jpg" },
      { name: "Subtle Sky Blue", hex: "#E2EDF8", image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1000&q=80" },
      { name: "Classic Biscuit Camel", hex: "#D6C7B2", image: "/images/mens_boski.jpg" },
      { name: "Deep Navy Blue", hex: "#1D2A44", image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1000&q=80" }
    ],
    images: [
      "/images/mens_boski.jpg",
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1000&q=80"
    ],
    badge: "New Arrival",
    stock: 28,
    inStock: true,
    rating: 4.9,
    reviewCount: 31,
    featured: true,
    createdAt: "2026-03-05T10:00:00Z"
  },
  {
    id: "prod-6",
    name: "Heritage Handwoven Karandi Shawl Suit (3-Piece)",
    slug: "heritage-handwoven-karandi-shawl-suit",
    sku: "LF-KRD-006",
    price: 8250,
    originalPrice: 9800,
    category: "karandi-winter",
    fabricType: "Original Textured Cotton-Silk Karandi with Heavy Woolen Shawl",
    cutLength: "3-Piece Unstitched (Shirt 3m, Trouser 2.5m, Shawl 2.5m)",
    pieces: "3-Piece",
    description: "Authentic textured Karandi fabric with intricate resham thread embroidery across the neckline and sleeves. Paired with a warm, plush jacquard woven Karandi shawl that adds majestic warmth to your winter wardrobe.",
    details: [
      "Embroidered Textured Karandi Shirt Front & Neckline (1.25m)",
      "Karandi Shirt Back & Sleeves (1.75m)",
      "Luxury Handwoven Karandi Shawl with rich pallu borders (2.5m)",
      "Dyed Warm Karandi Trouser (2.5m)"
    ],
    features: {
      weave: "Hand-spun Textured Karandi Slub Weave",
      season: "Winter",
      transparency: "Non-Transparent",
      softness: "Warm & Rich",
      shrinkage: "Pre-treated"
    },
    colors: [
      { name: "Warm Rust Amber", hex: "#C86D51", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80" },
      { name: "Rich Emerald Green", hex: "#234E3E", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80" },
      { name: "Oatmeal Beige", hex: "#D8CCB8", image: "/images/hero.jpg" }
    ],
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
      "/images/hero.jpg"
    ],
    badge: "Limited Stock",
    stock: 18,
    inStock: true,
    rating: 4.9,
    reviewCount: 19,
    featured: false,
    createdAt: "2026-03-06T10:00:00Z"
  },
  {
    id: "prod-7",
    name: "Banarasi Zari Brocade Pure Raw Silk Formal (2-Piece)",
    slug: "banarasi-zari-brocade-pure-raw-silk-2pc",
    sku: "LF-SLK-007",
    price: 9450,
    originalPrice: 11200,
    category: "festive-silk",
    fabricType: "Pure 80gm Raw Silk with Metallic Gold Zari Weave",
    cutLength: "2-Piece Unstitched (Shirt & Dupatta)",
    pieces: "2-Piece",
    description: "An opulent Banarasi jacquard silk unstitched suit woven with genuine antique gold zari threads. Reflects an aristocratic royal sheen under evening festive lights.",
    details: [
      "Gold Woven Banarasi Raw Silk Shirt (3.0m)",
      "Contrast Organza Zari Jaal Dupatta with finished tassels (2.5m)",
      "Ideal for weddings, dholkis, and festive dinners"
    ],
    features: {
      weave: "Banarasi Jacquard Zari Weave",
      season: "Festive / Wedding",
      transparency: "Opaque",
      softness: "Silky Smooth",
      shrinkage: "Dry clean only"
    },
    colors: [
      { name: "Royal Magenta Purple", hex: "#7E1F58", image: "/images/hero.jpg" },
      { name: "Golden Ivory Pearl", hex: "#F5EFE0", image: "/images/lawn_luxury.jpg" },
      { name: "Teal Peacock", hex: "#1A535C", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80" }
    ],
    images: [
      "/images/hero.jpg",
      "/images/lawn_luxury.jpg"
    ],
    badge: "Exclusive Luxury",
    stock: 14,
    inStock: true,
    rating: 5.0,
    reviewCount: 17,
    featured: false,
    createdAt: "2026-03-07T10:00:00Z"
  },
  {
    id: "prod-8",
    name: "Floral Shadow Hand-Blocked Summer Lawn Kurti Fabric",
    slug: "floral-shadow-hand-blocked-summer-lawn-kurti",
    sku: "LF-KRT-008",
    price: 2450,
    originalPrice: 2950,
    category: "women-unstitched",
    fabricType: "100% Breathable Combed Summer Lawn",
    cutLength: "Unstitched 2.5 Meters (Shirt / Kurti Length)",
    pieces: "1-Piece",
    description: "Artisanal hand block-printed pure lawn fabric with timeless botanical rose motifs in pastel hues. Lightweight, airy, and exceptionally pleasant for casual summer daytime wear.",
    details: [
      "2.5 Meters Standard Shirt Cut (Generous length for Long Kurti/Kameez)",
      "Traditional wooden block print technique with eco-friendly fast dyes",
      "Soft skin-friendly breathable cotton lawn"
    ],
    features: {
      weave: "Fine Plain Lawn Weave",
      season: "Summer",
      transparency: "Opaque",
      softness: "Ultra Soft / Breathable",
      shrinkage: "Color-fast guaranteed"
    },
    colors: [
      { name: "Sky Pastel Blue", hex: "#DCE9F5", image: "/images/lawn_luxury.jpg" },
      { name: "Peach Apricot", hex: "#F9DFC8", image: "/images/hero.jpg" },
      { name: "Lilac Lavender", hex: "#E8DDF2", image: "/images/lawn_luxury.jpg" }
    ],
    images: [
      "/images/lawn_luxury.jpg",
      "/images/hero.jpg"
    ],
    badge: "Sale",
    stock: 40,
    inStock: true,
    rating: 4.7,
    reviewCount: 52,
    featured: false,
    createdAt: "2026-03-08T10:00:00Z"
  }
];

export const INITIAL_ORDERS: any[] = [
  {
    id: "ord-101",
    orderNumber: "LF-94821",
    customer: {
      fullName: "Kamran Ali Khan",
      whatsappNumber: "+92 333 9123456",
      alternatePhone: "0300 8877665",
      email: "kamran.khan@example.com",
      address: "House 42, Street 8, Sector F-10/2",
      city: "Islamabad",
      province: "Federal Capital",
      orderNotes: "Please deliver before Friday afternoon prayer."
    },
    items: [
      {
        productId: "prod-2",
        productName: "Executive Royal Imperial Boski (Men's Unstitched Suit)",
        colorName: "Heritage Cream Boski (Off-White)",
        colorHex: "#FAF5E4",
        image: "/images/mens_boski.jpg",
        cutLength: "Unstitched 4.5 Meters (Generous Men's Suit Cut)",
        price: 7490,
        quantity: 1,
        total: 7490
      }
    ],
    subtotal: 7490,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 7490,
    paymentMethod: "cod",
    status: "confirmed",
    createdAt: "2026-03-12T14:30:00Z",
    updatedAt: "2026-03-12T15:00:00Z",
    whatsappSent: true
  },
  {
    id: "ord-102",
    orderNumber: "LF-94822",
    customer: {
      fullName: "Zainab Bibi",
      whatsappNumber: "+92 345 8899001",
      email: "zainab.shewa@example.com",
      address: "Main Bazar Near Jamia Masjid, Shewa",
      city: "Swabi",
      province: "Khyber Pakhtunkhwa",
      orderNotes: "Self pickup / local Shewa runner delivery"
    },
    items: [
      {
        productId: "prod-1",
        productName: "Aurelia Royal Gold Embroidered Swiss Lawn (3-Piece)",
        colorName: "Pearl Ivory & Gold",
        colorHex: "#FDFBF7",
        image: "/images/lawn_luxury.jpg",
        cutLength: "3-Piece Unstitched (Shirt 3m, Trouser 2.5m, Dupatta 2.5m)",
        price: 6850,
        quantity: 2,
        total: 13700
      }
    ],
    subtotal: 13700,
    shippingFee: 0,
    discountAmount: 1000,
    promoCode: "LUQMAN10",
    totalAmount: 12700,
    paymentMethod: "cod",
    status: "processing",
    createdAt: "2026-03-13T09:15:00Z",
    updatedAt: "2026-03-13T10:00:00Z",
    whatsappSent: true
  },
  {
    id: "ord-103",
    orderNumber: "LF-94823",
    customer: {
      fullName: "Muhammad Usman",
      whatsappNumber: "+92 301 7766554",
      address: "Flat 4B, Al-Noor Heights, Gulberg III",
      city: "Lahore",
      province: "Punjab",
      orderNotes: "Please pack in gift wrapping box"
    },
    items: [
      {
        productId: "prod-3",
        productName: "Sovereign Wash & Wear Wrinkle-Free Tropical Fabric",
        colorName: "Steel Silver Grey",
        colorHex: "#D2D6DC",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80",
        cutLength: "Unstitched 4.0 Meters Large Width (4m Bara Arzz)",
        price: 3950,
        quantity: 1,
        total: 3950
      }
    ],
    subtotal: 3950,
    shippingFee: 250,
    discountAmount: 0,
    totalAmount: 4200,
    paymentMethod: "cod",
    status: "pending",
    createdAt: "2026-03-14T08:20:00Z",
    updatedAt: "2026-03-14T08:20:00Z",
    whatsappSent: false
  }
];

export const CATEGORIES_DATA = [
  {
    id: "women-unstitched",
    name: "Women's Luxury Lawn",
    subtitle: "Swiss Voile, Digital Prints & Thread Embroidery",
    count: 14,
    image: "/images/lawn_luxury.jpg",
    slug: "women-unstitched"
  },
  {
    id: "men-unstitched",
    name: "Men's Executive Boski & Wash & Wear",
    subtitle: "Authentic 6-Pound Boski, Latha & Tropical Fabrics",
    count: 18,
    image: "/images/mens_boski.jpg",
    slug: "men-unstitched"
  },
  {
    id: "chiffon-luxury",
    name: "Chiffon & Wedding Formals",
    subtitle: "Zari, Tilla & Handcrafted Sequin Embroideries",
    count: 9,
    image: "/images/hero.jpg",
    slug: "chiffon-luxury"
  },
  {
    id: "pure-cotton",
    name: "Pure Egyptian & Giza Cotton",
    subtitle: "Superfine 100/2 Liquid Ammonia Luster Weaves",
    count: 12,
    image: "/images/mens_boski.jpg",
    slug: "pure-cotton"
  },
  {
    id: "karandi-winter",
    name: "Winter Karandi & Warm Khaddar",
    subtitle: "Textured Cotton-Silk Karandi with Heavy Shawls",
    count: 8,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    slug: "karandi-winter"
  },
  {
    id: "festive-silk",
    name: "Festive Silk & Jacquard",
    subtitle: "Banarasi Raw Silk & Zari Brocade",
    count: 7,
    image: "/images/hero.jpg",
    slug: "festive-silk"
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Dr. Farooq Shah",
    location: "Peshawar",
    rating: 5,
    comment: "The Boski fabric from Luqman Fabrics is 100% original. The fall, the sheen, and the weight are unmatched. Also, ordering directly on WhatsApp was seamless. Will definitely order again!",
    fabricBought: "Executive Royal Imperial Boski"
  },
  {
    id: 2,
    name: "Ayesha Malik",
    location: "Islamabad",
    rating: 5,
    comment: "I was hesitant buying embroidered lawn online, but the video preview they sent on WhatsApp before dispatching gave me complete confidence. The embroidery and Swiss lawn quality are 10/10.",
    fabricBought: "Aurelia Royal Gold Swiss Lawn (3-Piece)"
  },
  {
    id: 3,
    name: "Sardar Bilal Khan",
    location: "Mardan",
    rating: 5,
    comment: "Best fabric store in Shewa region. Delivered via courier in just 2 days. The Wash & Wear suit fabric is soft, cool, and wrinkle-resistant.",
    fabricBought: "Sovereign Wash & Wear Fabric"
  }
];
