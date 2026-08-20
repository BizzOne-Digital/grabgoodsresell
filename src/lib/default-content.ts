export const defaultHomeContent = {
  hero: {
    eyebrow: "Waxahachie, Texas • Local Pickup Only",
    title: "Hidden Gems. Great Finds. Ready for a New Home.",
    subtitle: "We find interesting things so you don't have to.",
    description:
      "From vintage treasures and estate-sale surprises to practical everyday items — browse our full inventory online and reserve what you love for local pickup.",
    primaryButton: { label: "Shop Inventory", href: "/shop" },
    secondaryButton: { label: "Ask About an Item", href: "/contact" },
    image: "/images/marketing/hero.png",
  },
  howItWorks: {
    title: "How It Works",
    subtitle: "Simple, friendly, and local.",
    steps: [
      {
        title: "Browse Online",
        description:
          "Explore our full inventory with photos, prices, and condition details.",
        icon: "search",
      },
      {
        title: "Add to Cart",
        description:
          "Reserve the items you want. We'll confirm availability before pickup.",
        icon: "cart",
      },
      {
        title: "Pick Up Locally",
        description:
          "Schedule a convenient pickup time in the Waxahachie area.",
        icon: "map-pin",
      },
    ],
  },
  about: {
    title: "About Grab My Goods Resell",
    image: "/images/marketing/about-story.png",
    content:
      "I've always had a passion for uncovering hidden gems — whether it's garage sales, estate finds, or the occasional lucky storage unit. You could say I've got a little Indiana Jones in me — I love the thrill of the hunt! I specialize in vintage finds, household goods, collectibles, and unique pieces that deserve a second life.",
    secondaryContent:
      "At Grab My Goods Resell, I keep things simple: fair prices, friendly communication, and a smooth local pickup experience. Whether you're a collector, bargain hunter, or neighbor looking for something useful, I'm always adding new items — you never know what treasure you'll grab next.",
    cta: { label: "Learn More About Us", href: "/about" },
  },
  upcomingSale: {
    enabled: true,
    title: "Upcoming In-Person Sale",
    description:
      "We host an in-person sale approximately every two weeks — like a friendly garage sale with great finds. Follow us on Facebook for dates and new arrivals.",
    cta: { label: "See Us on Facebook", href: "https://www.facebook.com/61579309705671/" },
  },
  categories: {
    title: "Shop by Category",
    subtitle: "Browse our constantly changing inventory.",
  },
  whyShop: {
    title: "Why Shop With Us",
    items: [
      {
        title: "Fair Prices",
        description: "Every item is researched and priced fairly — no guesswork.",
      },
      {
        title: "Clearly Described",
        description: "Honest condition details and photos so you know what you're getting.",
      },
      {
        title: "Local & Friendly",
        description: "A small home-based business built on trust and community.",
      },
      {
        title: "Always New Finds",
        description: "Inventory changes constantly — check back often for fresh treasures.",
      },
    ],
  },
  testimonials: {
    title: "What Customers Say",
    subtitle: "Real feedback from local buyers.",
  },
  faq: {
    title: "Common Questions",
    subtitle: "Quick answers before you shop.",
  },
  cta: {
    title: "Ready to Find Your Next Treasure?",
    description:
      "Browse the full inventory, ask about an item, or follow us on Facebook for new finds.",
    primaryButton: { label: "Browse Inventory", href: "/shop" },
    secondaryButton: { label: "Contact Us", href: "/contact" },
  },
};

export const defaultAboutContent = {
  hero: {
    title: "About Grab My Goods Resell",
    subtitle: "A local resale business built on trust, fair pricing, and great finds.",
    image: "/images/marketing/about-story.png",
  },
  story: {
    title: "Our Story",
    paragraphs: [
      "At Grab My Goods Resell, I keep things simple: fair prices, friendly communication, and a smooth local pickup experience right here in my clean, safe country neighborhood in Waxahachie, Texas.",
      "I specialize in vintage finds, household goods, collectibles, and unique pieces that deserve a second life. Whether it's a nostalgic toy, a well-made tool, a quirky décor item, or something practical for everyday use, I take the time to research each piece, price it fairly, and present it clearly.",
      "Grab My Goods Resell isn't just about selling stuff — it's about keeping things local, building trust in the community, and making every transaction feel like a good deal between good folks.",
    ],
  },
  values: {
    title: "What We Stand For",
    items: [
      { title: "Fair Pricing", description: "Every item researched and priced honestly." },
      { title: "Clear Listings", description: "Accurate photos and condition descriptions." },
      { title: "Local Community", description: "Supporting neighbors and treasure hunters alike." },
      { title: "Friendly Service", description: "Easy communication from browse to pickup." },
    ],
  },
  cta: {
    title: "Browse What's Available Now",
    description: "Inventory changes often — see what's in stock today.",
    button: { label: "Shop Inventory", href: "/shop" },
  },
};

export const defaultContactContent = {
  hero: {
    title: "Contact Us",
    subtitle: "Questions about an item? Ready to schedule pickup? We're here to help.",
  },
  intro:
    "Send us a message and we'll get back to you as soon as possible. You can also reach us by phone or Facebook.",
  formTitle: "Send a Message",
  pickupNote:
    "Local pickup only in the Waxahachie, Texas area. Pickup address and details are shared after your order is confirmed.",
};

export const defaultBookingContent = {
  hero: {
    title: "Book a Visit",
    subtitle: "Schedule a time to browse in person or arrange pickup.",
  },
  description:
    "Prefer to visit in person or need to schedule a pickup time? Use the options below or contact us directly.",
  bookingType: "contact",
  bookingUrl: "",
  embedCode: "",
  instructions:
    "Contact us by phone, email, or the form below to arrange a visit or pickup appointment.",
};

export const defaultPricingContent = {
  hero: {
    title: "Pricing & Sales",
    subtitle: "Fair prices, special finds, and occasional in-person sale events.",
  },
  intro:
    "Every item in our inventory is individually priced based on condition, research, and market value. We also host in-person sale events approximately every two weeks.",
  cards: [
    {
      title: "Everyday Inventory",
      price: "Varies by item",
      description: "Browse our online shop for current prices on all available items.",
      features: [
        "Individually researched pricing",
        "Condition clearly listed",
        "Photos of actual items",
        "Local pickup",
      ],
      cta: { label: "Browse Shop", href: "/shop" },
    },
    {
      title: "In-Person Sales",
      price: "Event pricing",
      description: "Join us for garage-sale-style events with fresh finds and great deals.",
      features: [
        "Approximately every 2 weeks",
        "New items added regularly",
        "Follow us on Facebook for dates",
        "Cash & local pickup",
      ],
      cta: {
        label: "Follow on Facebook",
        href: "https://www.facebook.com/61579309705671/",
      },
      featured: true,
    },
    {
      title: "Special Finds",
      price: "Premium items",
      description: "Collectibles, vintage pieces, and rare finds priced individually.",
      features: [
        "Detailed descriptions",
        "Multiple photos",
        "Reserve online",
        "Ask questions anytime",
      ],
      cta: { label: "Contact Us", href: "/contact" },
    },
  ],
};

export const defaultFAQs = [
  {
    question: "Do you ship items?",
    answer:
      "Currently we offer local pickup only in the Waxahachie, Texas area. Shipping may be added in the future.",
    sortOrder: 0,
  },
  {
    question: "Where do I pick up my order?",
    answer:
      "Pickup details are shared after your order is confirmed. Contact us if you need to arrange a specific time.",
    sortOrder: 1,
  },
  {
    question: "How often do you add new products?",
    answer:
      "New items are added regularly as we source from storage units, estate sales, garage sales, and more. Follow us on Facebook for the latest finds.",
    sortOrder: 2,
  },
  {
    question: "How do I reserve an item?",
    answer:
      "Add items to your cart and submit an order request. We'll confirm availability and arrange pickup with you.",
    sortOrder: 3,
  },
  {
    question: "Are items new or used?",
    answer:
      "Most items are pre-owned resale finds. Each listing includes a condition rating (New, Like New, Good, Fair, Used, Vintage, etc.).",
    sortOrder: 4,
  },
  {
    question: "How do I contact you about a specific item?",
    answer:
      "Use our contact form, call us at +1 817-715-7028, or message us on Facebook with the item name or link.",
    sortOrder: 5,
  },
  {
    question: "Do you accept returns?",
    answer:
      "Please contact us before purchasing if you have questions about an item. Return policies vary by item — ask us for details.",
    sortOrder: 6,
  },
];

export const defaultTestimonials = [
  {
    customerName: "Daniel K.",
    testimonial:
      "I honestly received the best service I could have asked for. Super professional, met all my needs, and made pickup easy.",
    rating: 5,
    featured: true,
    sortOrder: 0,
  },
  {
    customerName: "Ron H.",
    testimonial:
      "The entire experience was so easy and friendly, and the price was very reasonable. Highly recommend!",
    rating: 5,
    featured: true,
    sortOrder: 1,
  },
  {
    customerName: "James F.",
    testimonial:
      "I can't say enough good things about the quality of this business. Great finds and honest descriptions.",
    rating: 5,
    featured: false,
    sortOrder: 2,
  },
];
