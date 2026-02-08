// 15 Mock Listings with realistic data and reliable image URLs
export const listings = [
  {
    id: "1",
    title: "Stunning Ocean View Villa",
    type: "Entire villa",
    location: {
      city: "Santorini",
      country: "Greece",
      lat: 36.3932,
      lng: 25.4615
    },
    images: [
      "https://picsum.photos/seed/villa1/800/600",
      "https://picsum.photos/seed/villa2/800/600",
      "https://picsum.photos/seed/villa3/800/600",
      "https://picsum.photos/seed/villa4/800/600",
      "https://picsum.photos/seed/villa5/800/600"
    ],
    price: 235,
    rating: 4.92,
    reviewCount: 128,
    host: {
      name: "Maria",
      avatar: "https://i.pravatar.cc/100?img=1",
      isSuperhost: true,
      joinedYear: 2018
    },
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    description: "Experience luxury living in this stunning villa with breathtaking ocean views. Wake up to the sound of waves and enjoy your morning coffee on the private terrace overlooking the Aegean Sea. This meticulously designed space features modern amenities while maintaining authentic Greek charm. The infinity pool seems to merge with the horizon, creating an unforgettable visual experience.",
    amenities: ["Wifi", "Kitchen", "Pool", "Free parking", "AC", "TV", "Washer", "Hot tub", "BBQ grill", "Ocean view"],
    categories: ["beach", "amazing-views", "luxe"],
    availability: "Jan 12–17",
    isGuestFavorite: true
  },
  {
    id: "2",
    title: "Cozy Mountain Cabin Retreat",
    type: "Entire cabin",
    location: {
      city: "Aspen",
      country: "United States",
      lat: 39.1911,
      lng: -106.8175
    },
    images: [
      "https://picsum.photos/seed/cabin1/800/600",
      "https://picsum.photos/seed/cabin2/800/600",
      "https://picsum.photos/seed/cabin3/800/600",
      "https://picsum.photos/seed/cabin4/800/600",
      "https://picsum.photos/seed/cabin5/800/600"
    ],
    price: 189,
    rating: 4.88,
    reviewCount: 95,
    host: {
      name: "John",
      avatar: "https://i.pravatar.cc/100?img=3",
      isSuperhost: true,
      joinedYear: 2016
    },
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    description: "Escape to this enchanting mountain cabin nestled among towering pines. Perfect for ski enthusiasts in winter or hikers in summer, this cozy retreat offers the ultimate mountain getaway. Curl up by the wood-burning fireplace after an adventurous day outdoors. The cabin features rustic charm with modern comforts.",
    amenities: ["Wifi", "Kitchen", "Free parking", "Fireplace", "Mountain view", "Heating", "Coffee maker", "BBQ grill"],
    categories: ["cabins", "skiing", "countryside"],
    availability: "Feb 1–6",
    isGuestFavorite: false
  },
  {
    id: "3",
    title: "Modern Beachfront Apartment",
    type: "Entire apartment",
    location: {
      city: "Miami",
      country: "United States",
      lat: 25.7617,
      lng: -80.1918
    },
    images: [
      "https://picsum.photos/seed/miami1/800/600",
      "https://picsum.photos/seed/miami2/800/600",
      "https://picsum.photos/seed/miami3/800/600",
      "https://picsum.photos/seed/miami4/800/600",
      "https://picsum.photos/seed/miami5/800/600"
    ],
    price: 175,
    rating: 4.85,
    reviewCount: 203,
    host: {
      name: "Sophie",
      avatar: "https://i.pravatar.cc/100?img=5",
      isSuperhost: false,
      joinedYear: 2020
    },
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    description: "Step into this sleek, contemporary apartment just steps from the beach. Floor-to-ceiling windows flood the space with natural light and offer stunning views of the Atlantic. The designer kitchen is perfect for preparing fresh meals, and the rooftop pool provides a perfect sunset viewing spot.",
    amenities: ["Wifi", "Kitchen", "Pool", "AC", "TV", "Washer", "Gym", "Beach access", "Balcony"],
    categories: ["beach", "trending"],
    availability: "Jan 20–25",
    isGuestFavorite: true
  },
  {
    id: "4",
    title: "Historic Castle Tower Suite",
    type: "Private room",
    location: {
      city: "Edinburgh",
      country: "United Kingdom",
      lat: 55.9533,
      lng: -3.1883
    },
    images: [
      "https://picsum.photos/seed/castle1/800/600",
      "https://picsum.photos/seed/castle2/800/600",
      "https://picsum.photos/seed/castle3/800/600",
      "https://picsum.photos/seed/castle4/800/600",
      "https://picsum.photos/seed/castle5/800/600"
    ],
    price: 320,
    rating: 4.97,
    reviewCount: 67,
    host: {
      name: "William",
      avatar: "https://i.pravatar.cc/100?img=8",
      isSuperhost: true,
      joinedYear: 2015
    },
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: "Live like royalty in this authentic castle tower dating back to the 15th century. This unique accommodation offers a once-in-a-lifetime experience with original stone walls, spiral staircases, and period furnishings. Yet you'll enjoy all modern amenities including central heating and high-speed wifi.",
    amenities: ["Wifi", "Heating", "TV", "Historic building", "Garden", "Library access", "Breakfast included"],
    categories: ["castles", "design", "omg"],
    availability: "Mar 5–10",
    isGuestFavorite: true
  },
  {
    id: "5",
    title: "Tropical Paradise Treehouse",
    type: "Entire home",
    location: {
      city: "Bali",
      country: "Indonesia",
      lat: -8.4095,
      lng: 115.1889
    },
    images: [
      "https://picsum.photos/seed/bali1/800/600",
      "https://picsum.photos/seed/bali2/800/600",
      "https://picsum.photos/seed/bali3/800/600",
      "https://picsum.photos/seed/bali4/800/600",
      "https://picsum.photos/seed/bali5/800/600"
    ],
    price: 145,
    rating: 4.94,
    reviewCount: 312,
    host: {
      name: "Wayan",
      avatar: "https://i.pravatar.cc/100?img=12",
      isSuperhost: true,
      joinedYear: 2017
    },
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: "Reconnect with nature in this stunning bamboo treehouse set among lush jungle canopy. Wake to the sounds of tropical birds and enjoy your private infinity pool overlooking the rice terraces. This eco-friendly retreat combines traditional Balinese architecture with sustainable luxury.",
    amenities: ["Wifi", "Pool", "AC", "Rice paddy view", "Outdoor shower", "Yoga deck", "Breakfast included", "Jungle view"],
    categories: ["treehouses", "tropical", "omg", "amazing-views"],
    availability: "Jan 8–13",
    isGuestFavorite: true
  },
  {
    id: "6",
    title: "Lakefront Modern Mansion",
    type: "Entire home",
    location: {
      city: "Lake Como",
      country: "Italy",
      lat: 45.9870,
      lng: 9.2572
    },
    images: [
      "https://picsum.photos/seed/como1/800/600",
      "https://picsum.photos/seed/como2/800/600",
      "https://picsum.photos/seed/como3/800/600",
      "https://picsum.photos/seed/como4/800/600",
      "https://picsum.photos/seed/como5/800/600"
    ],
    price: 495,
    rating: 4.96,
    reviewCount: 89,
    host: {
      name: "Isabella",
      avatar: "https://i.pravatar.cc/100?img=9",
      isSuperhost: true,
      joinedYear: 2014
    },
    guests: 10,
    bedrooms: 5,
    beds: 6,
    bathrooms: 4,
    description: "Experience la dolce vita in this magnificent lakefront mansion on the shores of Lake Como. With private dock access, a stunning infinity pool, and manicured gardens, this property offers the ultimate Italian luxury escape. Each room has been designed with impeccable taste.",
    amenities: ["Wifi", "Kitchen", "Pool", "Free parking", "AC", "TV", "Washer", "Hot tub", "Lake view", "Private dock", "Garden"],
    categories: ["lakefront", "mansions", "luxe", "amazing-views"],
    availability: "Apr 1–6",
    isGuestFavorite: true
  },
  {
    id: "7",
    title: "Desert Glamping Dome",
    type: "Entire home",
    location: {
      city: "Joshua Tree",
      country: "United States",
      lat: 34.1347,
      lng: -116.3131
    },
    images: [
      "https://picsum.photos/seed/desert1/800/600",
      "https://picsum.photos/seed/desert2/800/600",
      "https://picsum.photos/seed/desert3/800/600",
      "https://picsum.photos/seed/desert4/800/600",
      "https://picsum.photos/seed/desert5/800/600"
    ],
    price: 199,
    rating: 4.89,
    reviewCount: 156,
    host: {
      name: "Alex",
      avatar: "https://i.pravatar.cc/100?img=15",
      isSuperhost: true,
      joinedYear: 2019
    },
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: "Stargaze from your transparent dome in the heart of Joshua Tree National Park. This unique glamping experience offers the beauty of camping with luxury amenities. Watch the Milky Way from your king-size bed and explore the otherworldly desert landscape.",
    amenities: ["Wifi", "Kitchen", "AC", "Stargazing", "Fire pit", "Outdoor shower", "Desert view", "Hot tub"],
    categories: ["omg", "national-parks", "design", "amazing-views"],
    availability: "Feb 15–20",
    isGuestFavorite: false
  },
  {
    id: "8",
    title: "Charming Vineyard Cottage",
    type: "Entire cottage",
    location: {
      city: "Napa Valley",
      country: "United States",
      lat: 38.2975,
      lng: -122.2869
    },
    images: [
      "https://picsum.photos/seed/napa1/800/600",
      "https://picsum.photos/seed/napa2/800/600",
      "https://picsum.photos/seed/napa3/800/600",
      "https://picsum.photos/seed/napa4/800/600",
      "https://picsum.photos/seed/napa5/800/600"
    ],
    price: 275,
    rating: 4.91,
    reviewCount: 142,
    host: {
      name: "Robert",
      avatar: "https://i.pravatar.cc/100?img=7",
      isSuperhost: true,
      joinedYear: 2017
    },
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    description: "Nestled among rolling vineyards, this charming cottage offers the perfect wine country retreat. Enjoy complimentary wine tastings at the estate winery and take sunset walks through the vines. The cottage features a gourmet kitchen and a cozy fireplace.",
    amenities: ["Wifi", "Kitchen", "Free parking", "Fireplace", "Vineyard view", "Wine tasting", "BBQ grill", "Garden"],
    categories: ["vineyards", "countryside", "farms"],
    availability: "Mar 10–15",
    isGuestFavorite: false
  },
  {
    id: "9",
    title: "Houseboat on Amsterdam Canals",
    type: "Entire boat",
    location: {
      city: "Amsterdam",
      country: "Netherlands",
      lat: 52.3676,
      lng: 4.9041
    },
    images: [
      "https://picsum.photos/seed/amsterdam1/800/600",
      "https://picsum.photos/seed/amsterdam2/800/600",
      "https://picsum.photos/seed/amsterdam3/800/600",
      "https://picsum.photos/seed/amsterdam4/800/600",
      "https://picsum.photos/seed/amsterdam5/800/600"
    ],
    price: 165,
    rating: 4.86,
    reviewCount: 234,
    host: {
      name: "Emma",
      avatar: "https://i.pravatar.cc/100?img=10",
      isSuperhost: false,
      joinedYear: 2018
    },
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    description: "Experience Amsterdam like a local on this beautifully restored houseboat in the historic canal district. Watch the world float by from your private deck while enjoying the gently rocking waters. Walking distance to museums, restaurants, and nightlife.",
    amenities: ["Wifi", "Kitchen", "Heating", "TV", "Canal view", "Deck", "Bikes included"],
    categories: ["houseboats", "design", "trending"],
    availability: "Jan 25–30",
    isGuestFavorite: true
  },
  {
    id: "10",
    title: "Luxury Ski Chalet",
    type: "Entire chalet",
    location: {
      city: "Zermatt",
      country: "Switzerland",
      lat: 46.0207,
      lng: 7.7491
    },
    images: [
      "https://picsum.photos/seed/swiss1/800/600",
      "https://picsum.photos/seed/swiss2/800/600",
      "https://picsum.photos/seed/swiss3/800/600",
      "https://picsum.photos/seed/swiss4/800/600",
      "https://picsum.photos/seed/swiss5/800/600"
    ],
    price: 650,
    rating: 4.98,
    reviewCount: 76,
    host: {
      name: "Marco",
      avatar: "https://i.pravatar.cc/100?img=11",
      isSuperhost: true,
      joinedYear: 2013
    },
    guests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3,
    description: "Ski-in/ski-out luxury in the shadow of the Matterhorn. This stunning chalet features panoramic Alpine views, a private sauna, and a dedicated chef option. After a day on the slopes, relax in the outdoor hot tub while watching the sunset paint the mountains.",
    amenities: ["Wifi", "Kitchen", "Free parking", "Hot tub", "Sauna", "Ski-in/ski-out", "Mountain view", "Fireplace", "Heating"],
    categories: ["skiing", "luxe", "amazing-views", "cabins"],
    availability: "Dec 20–25",
    isGuestFavorite: true
  },
  {
    id: "11",
    title: "Seaside Windmill Suite",
    type: "Entire home",
    location: {
      city: "Mykonos",
      country: "Greece",
      lat: 37.4467,
      lng: 25.3285
    },
    images: [
      "https://picsum.photos/seed/mykonos1/800/600",
      "https://picsum.photos/seed/mykonos2/800/600",
      "https://picsum.photos/seed/mykonos3/800/600",
      "https://picsum.photos/seed/mykonos4/800/600",
      "https://picsum.photos/seed/mykonos5/800/600"
    ],
    price: 285,
    rating: 4.93,
    reviewCount: 98,
    host: {
      name: "Nikos",
      avatar: "https://i.pravatar.cc/100?img=4",
      isSuperhost: true,
      joinedYear: 2016
    },
    guests: 3,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: "Stay in a converted 16th-century windmill overlooking the Aegean Sea. This iconic Mykonos landmark has been lovingly restored to offer a unique romantic getaway. Watch cruise ships pass by from your private terrace and enjoy the famous Cycladic sunset.",
    amenities: ["Wifi", "Kitchen", "AC", "TV", "Ocean view", "Terrace", "Historic building"],
    categories: ["windmills", "beach", "omg", "design"],
    availability: "May 1–6",
    isGuestFavorite: true
  },
  {
    id: "12",
    title: "Moroccan Riad with Pool",
    type: "Entire home",
    location: {
      city: "Marrakech",
      country: "Morocco",
      lat: 31.6295,
      lng: -7.9811
    },
    images: [
      "https://picsum.photos/seed/morocco1/800/600",
      "https://picsum.photos/seed/morocco2/800/600",
      "https://picsum.photos/seed/morocco3/800/600",
      "https://picsum.photos/seed/morocco4/800/600",
      "https://picsum.photos/seed/morocco5/800/600"
    ],
    price: 195,
    rating: 4.87,
    reviewCount: 187,
    host: {
      name: "Fatima",
      avatar: "https://i.pravatar.cc/100?img=16",
      isSuperhost: true,
      joinedYear: 2015
    },
    guests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 3,
    description: "Step through the ornate doors into this stunning traditional riad in the heart of the Medina. The central courtyard features a refreshing plunge pool surrounded by intricate tilework and lush plants. Each room showcases authentic Moroccan craftsmanship.",
    amenities: ["Wifi", "Kitchen", "Pool", "AC", "Rooftop terrace", "Breakfast included", "Hammam", "Courtyard"],
    categories: ["design", "pools", "trending"],
    availability: "Feb 8–13",
    isGuestFavorite: false
  },
  {
    id: "13",
    title: "Island Beach Bungalow",
    type: "Entire bungalow",
    location: {
      city: "Maldives",
      country: "Maldives",
      lat: 4.1755,
      lng: 73.5093
    },
    images: [
      "https://picsum.photos/seed/maldives1/800/600",
      "https://picsum.photos/seed/maldives2/800/600",
      "https://picsum.photos/seed/maldives3/800/600",
      "https://picsum.photos/seed/maldives4/800/600",
      "https://picsum.photos/seed/maldives5/800/600"
    ],
    price: 425,
    rating: 4.95,
    reviewCount: 156,
    host: {
      name: "Ahmed",
      avatar: "https://i.pravatar.cc/100?img=13",
      isSuperhost: true,
      joinedYear: 2017
    },
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: "Wake up to turquoise waters in this overwater bungalow in the Maldives. Glass floor panels let you watch tropical fish swim beneath you. Includes kayaks, snorkeling gear, and daily housekeeping. The ultimate island escape.",
    amenities: ["Wifi", "AC", "Ocean view", "Private deck", "Glass floor", "Snorkeling gear", "Kayaks", "Breakfast included"],
    categories: ["islands", "beach", "luxe", "tropical"],
    availability: "Mar 15–20",
    isGuestFavorite: true
  },
  {
    id: "14",
    title: "Urban Loft with City Views",
    type: "Entire loft",
    location: {
      city: "New York",
      country: "United States",
      lat: 40.7128,
      lng: -74.0060
    },
    images: [
      "https://picsum.photos/seed/nyc1/800/600",
      "https://picsum.photos/seed/nyc2/800/600",
      "https://picsum.photos/seed/nyc3/800/600",
      "https://picsum.photos/seed/nyc4/800/600",
      "https://picsum.photos/seed/nyc5/800/600"
    ],
    price: 299,
    rating: 4.84,
    reviewCount: 267,
    host: {
      name: "Michael",
      avatar: "https://i.pravatar.cc/100?img=6",
      isSuperhost: false,
      joinedYear: 2019
    },
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    description: "Live like a New Yorker in this stunning industrial loft in SoHo. Exposed brick walls, soaring 14-foot ceilings, and oversized windows define this quintessential NYC space. Steps from art galleries, boutiques, and world-class dining.",
    amenities: ["Wifi", "Kitchen", "AC", "TV", "Washer", "Dryer", "City view", "Gym access"],
    categories: ["design", "trending"],
    availability: "Jan 5–10",
    isGuestFavorite: false
  },
  {
    id: "15",
    title: "Tiny House in the Woods",
    type: "Entire home",
    location: {
      city: "Portland",
      country: "United States",
      lat: 45.5152,
      lng: -122.6784
    },
    images: [
      "https://picsum.photos/seed/portland1/800/600",
      "https://picsum.photos/seed/portland2/800/600",
      "https://picsum.photos/seed/portland3/800/600",
      "https://picsum.photos/seed/portland4/800/600",
      "https://picsum.photos/seed/portland5/800/600"
    ],
    price: 125,
    rating: 4.9,
    reviewCount: 189,
    host: {
      name: "Sarah",
      avatar: "https://i.pravatar.cc/100?img=2",
      isSuperhost: true,
      joinedYear: 2018
    },
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: "Disconnect and recharge in this beautifully crafted tiny house surrounded by Pacific Northwest forest. The thoughtfully designed space maximizes every inch while maintaining a spacious feel. Perfect for a romantic getaway or solo retreat.",
    amenities: ["Wifi", "Kitchen", "Free parking", "Fireplace", "Forest view", "Fire pit", "Hiking trails"],
    categories: ["tiny-homes", "countryside", "cabins", "national-parks"],
    availability: "Feb 20–25",
    isGuestFavorite: true
  }
];

// Generate mock reviews
export const generateReviews = () => [
  {
    id: "r1",
    name: "Sarah",
    avatar: "https://i.pravatar.cc/100?img=20",
    date: "October 2024",
    rating: 5,
    comment: "Absolutely amazing place! The views were even better than the photos. Maria was an incredible host who made sure we had everything we needed. Would definitely come back!"
  },
  {
    id: "r2",
    name: "James",
    avatar: "https://i.pravatar.cc/100?img=21",
    date: "September 2024",
    rating: 5,
    comment: "Perfect getaway spot. The location is unbeatable and the amenities exceeded our expectations. Highly recommend for anyone looking for a peaceful retreat."
  },
  {
    id: "r3",
    name: "Emily",
    avatar: "https://i.pravatar.cc/100?img=22",
    date: "September 2024",
    rating: 4,
    comment: "Beautiful property with stunning views. The only minor issue was the WiFi being a bit slow at times, but otherwise everything was perfect."
  },
  {
    id: "r4",
    name: "David",
    avatar: "https://i.pravatar.cc/100?img=23",
    date: "August 2024",
    rating: 5,
    comment: "This was the highlight of our trip! The space is beautifully designed and the host thought of every detail. Can't wait to visit again."
  },
  {
    id: "r5",
    name: "Lisa",
    avatar: "https://i.pravatar.cc/100?img=24",
    date: "August 2024",
    rating: 5,
    comment: "Exceeded all expectations. The photos don't do it justice - you have to see it in person. Host was responsive and very accommodating."
  },
  {
    id: "r6",
    name: "Michael",
    avatar: "https://i.pravatar.cc/100?img=25",
    date: "July 2024",
    rating: 5,
    comment: "One of the best Airbnb experiences I've ever had. The location, the space, the amenities - all perfect. Highly recommend!"
  }
];

// Rating breakdown (mock data)
export const ratingBreakdown = {
  cleanliness: 4.9,
  accuracy: 5.0,
  checkIn: 4.8,
  communication: 4.9,
  location: 5.0,
  value: 4.8
};
