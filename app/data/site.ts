export type Project = {
  id: string;
  index: string;
  name: string;
  client: string;
  sector: string;
  year: string;
  headline: string;
  summary: string;
  stack: string[];
  image: string;
  video: string;
  href: string;
};

export type ShippedItem = {
  id: string;
  name: string;
  sector: string;
  stack: string;
};

export type Capability = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  tools: string[];
};

export type MethodStep = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  resolved: boolean;
};

export type Stat = {id: string; value: string; label: string};
export type Fact = {id: string; label: string; value: string};
export type NavLinkItem = {
  id: string;
  name: string;
  href: string;
  variant: "text" | "button";
};

export const CONTACT_EMAIL = "noerrtech@gmail.com";

export const NAV_LINKS: NavLinkItem[] = [
  {id: "work", name: "Work", href: "#work", variant: "text"},
  {id: "capabilities", name: "Capabilities", href: "#capabilities", variant: "text"},
  {id: "method", name: "Method", href: "#method", variant: "text"},
  {id: "contact", name: "Start a project", href: "#contact", variant: "button"},
];

export const STATS: Stat[] = [
  {id: "shipped", value: "30+", label: "Products shipped"},
  {id: "industries", value: "9", label: "Industries"},
  {id: "maintained", value: "6", label: "Live platforms maintained"},
  {id: "team", value: "1", label: "Team, end to end"},
];

/** Screenshots are captured from the live deployments in /public/work. */
export const PROJECTS: Project[] = [
  {
    id: "neptune",
    index: "01",
    name: "Neptune Container",
    client: "Neptune Container Line & Logistics",
    sector: "Shipping & logistics",
    year: "2025",
    headline: "Move complex cargo across India and the world.",
    summary:
      "A logistics platform that has to read as institutionally solid — containerised, project and hazardous freight, twelve Indian branches, a global agent network. Motion-led marketing surface plus dedicated event microsites for Pacific Shipping Summit, Breakbulk Americas and TransportLogistics.",
    stack: ["React", "Three.js", "GSAP", "Framer Motion", "Tailwind"],
    video: "/work/neptune.mp4",
    image: "/work/neptune.jpg",
    href: "https://neptune-containers.web.app",
  },
  {
    id: "raresquare",
    index: "02",
    name: "RareSquare Studio",
    client: "RareSquare",
    sector: "Ecommerce",
    year: "2025",
    headline: "Gifts as rare as the ones you love.",
    summary:
      "Personalised gifting storefront with a full commerce backend behind it — catalogue, cart, orders, payments and an admin panel, built as a monorepo so the storefront and dashboard ship independently.",
    stack: ["Turborepo", "Prisma", "PostgreSQL", "Supabase", "Razorpay", "Firebase"],
    video: "/work/raresquare.mp4",
    image: "/work/raresquare.jpg",
    href: "https://raresquare.web.app",
  },
  {
    id: "dermalicious",
    index: "03",
    name: "Dermalicious",
    client: "Dermalicious Clinic",
    sector: "Healthcare",
    year: "2025",
    headline: "Integrated multi-specialty healthcare.",
    summary:
      "A credibility-first clinic site for a practice where trust decides whether someone books. Server-rendered for search, with treatment structure and enquiry paths designed around how patients actually arrive.",
    stack: ["React Router", "GSAP", "SSR"],
    video: "/work/dermalicious.mp4",
    image: "/work/dermalicious.jpg",
    href: "https://dermalicious-noerr.web.app",
  },
  {
    id: "south-mumbai-united",
    index: "04",
    name: "South Mumbai United",
    client: "South Mumbai United FC",
    sector: "Sport",
    year: "2025",
    headline: "The club, online.",
    summary:
      "Digital home for a Mumbai football club — squad, fixtures and club identity, built to hold up when matchday traffic spikes and the whole supporter base arrives at once.",
    stack: ["React", "Firebase"],
    video: "/work/south-mumbai-united.mp4",
    image: "/work/south-mumbai-united.jpg",
    href: "https://reactsmu.web.app",
  },
  {
    id: "tara-staycation",
    index: "05",
    name: "Tara Staycation",
    client: "Tara Staycation",
    sector: "Hospitality",
    year: "2025",
    headline: "Somewhere worth staying.",
    summary:
      "Property and booking presence for a staycation brand, where the photography carries the sell and the enquiry path stays short enough that people finish it.",
    stack: ["React Router", "Framer Motion", "Tailwind"],
    video: "/work/tara-staycation.mp4",
    image: "/work/tara-staycation.jpg",
    href: "https://tarastaycation.web.app",
  },
  {
    id: "rait-studio",
    index: "06",
    name: "Rait Studio",
    client: "Rait Studio",
    sector: "Creative",
    year: "2025",
    headline: "A studio that looks like one.",
    summary:
      "Portfolio platform for a creative studio — the work has to be the interface, so the layout gets out of the way and the imagery does the arguing.",
    stack: ["React Router", "Tailwind"],
    video: "/work/rait-studio.mp4",
    image: "/work/rait-studio.jpg",
    href: "https://rait-studio.web.app",
  },
];

export const ALSO_SHIPPED: ShippedItem[] = [
  {id: "mystery-crate", name: "Mystery Crate", sector: "D2C · Mobile", stack: "Flutter · Amplify · Next.js"},
  {id: "akshar", name: "Akshar Studio", sector: "Creative tools", stack: "Next.js · Three.js"},
  {id: "founderbrain", name: "FounderBrain", sector: "AI · SaaS", stack: "Next.js · OpenAI"},
  {id: "mumma-approved", name: "Mumma Approved", sector: "D2C content", stack: "Next.js"},
  {id: "jt", name: "JT Ecommerce", sector: "Ecommerce", stack: "Remix"},
  {id: "sportz", name: "Sportz Interactive", sector: "Sport tech", stack: "Full stack"},
  {id: "thakor", name: "Thakor Electronics", sector: "Retail", stack: "React"},
  {id: "flexhale", name: "FlexHale Physio", sector: "Healthcare", stack: "React"},
  {id: "invoicing", name: "Noerr Invoicing", sector: "Internal tooling", stack: "Next.js · PostgreSQL"},
];

export type Testimonial = {
  id: string;
  quote: string;
  metric: string;
  name: string;
  role: string;
  company: string;
  initials: string;
};

/**
 * SAMPLE COPY — placeholder people at invented companies, written to size the
 * layout. None of these are real clients. Swap for signed-off quotes before
 * this site goes live.
 */
export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "sample-1",
    quote:
      "We came in with a half-finished build and a launch date we couldn't move. They took the whole thing over, shipped in five weeks, and it hasn't gone down since.",
    metric: "Live in 5 weeks",
    name: "Priya Raghavan",
    role: "Founder",
    company: "Kestrel & Co",
    initials: "PR",
  },
  {
    id: "sample-2",
    quote:
      "Checkout was losing us orders and nobody could tell us why. They found it in two days and rebuilt the flow properly.",
    metric: "Conversion 1.4% → 3.9%",
    name: "Daniel Okoye",
    role: "Head of Ecommerce",
    company: "Northbay Supply",
    initials: "DO",
  },
  {
    id: "sample-3",
    quote:
      "The only team we've worked with that actually stayed after launch. Two years on, they still ship every release for us.",
    metric: "2 years, still shipping",
    name: "Meera Shah",
    role: "Chief Operating Officer",
    company: "Lantern Health",
    initials: "MS",
  },
];

export const CAPABILITIES: Capability[] = [
  {
    id: "product-design",
    eyebrow: "Interface",
    title: "Product design",
    summary:
      "Identity, interface and motion design for products that have to feel considered on first open.",
    tools: ["UI systems", "Design tokens", "Motion", "Prototypes"],
  },
  {
    id: "web",
    eyebrow: "Front of house",
    title: "Web platforms",
    summary:
      "Marketing sites and full applications, server-rendered where it matters for speed and search.",
    tools: ["Next.js", "Remix", "React Router", "Tailwind", "Three.js", "GSAP"],
  },
  {
    id: "mobile",
    eyebrow: "In hand",
    title: "Mobile",
    summary:
      "Cross-platform apps shipped to both stores, sharing one backend with the web product.",
    tools: ["Flutter", "Amplify", "Push & auth"],
  },
  {
    id: "backend",
    eyebrow: "Underneath",
    title: "Backend & data",
    summary:
      "APIs, schemas and the boring reliability work — the part that decides whether launch holds.",
    tools: ["Node", "NestJS", "Express", "PostgreSQL", "Prisma", "Supabase", "Firebase"],
  },
  {
    id: "commerce",
    eyebrow: "Money",
    title: "Commerce & payments",
    summary:
      "Checkout, subscriptions and invoicing wired to real gateways, tested against real edge cases.",
    tools: ["Razorpay", "Stripe", "Sanity", "Invoicing"],
  },
  {
    id: "ai",
    eyebrow: "New",
    title: "AI features",
    summary:
      "Model-backed features built into products — transcription, extraction, generation — not bolted on as a demo.",
    tools: ["OpenAI", "Voice capture", "Structured output"],
  },
];

export const MARQUEE_ITEMS: string[] = [
  "React",
  "Next.js",
  "Remix",
  "Flutter",
  "Three.js",
  "GSAP",
  "Node",
  "NestJS",
  "PostgreSQL",
  "Prisma",
  "Supabase",
  "Firebase",
  "Razorpay",
  "Stripe",
  "OpenAI",
  "Tailwind",
];

export const METHOD_STEPS: MethodStep[] = [
  {
    id: "define",
    eyebrow: "Draft one",
    title: "Define",
    summary:
      "What the product owes its user, and the shortest route there. Scope gets cut here, not mid-build.",
    resolved: false,
  },
  {
    id: "design",
    eyebrow: "Draft two",
    title: "Design",
    summary:
      "Interface and system in one pass, in the browser early, so what you approve is what runs.",
    resolved: false,
  },
  {
    id: "build",
    eyebrow: "Draft three",
    title: "Build",
    summary:
      "Typed, reviewed, deployed on a real pipeline — with the backend built by the same people.",
    resolved: false,
  },
  {
    id: "hold",
    eyebrow: "Resolved",
    title: "Hold",
    summary:
      "We stay on after launch. Monitoring, fixes, the next release — the version that ships clean stays clean.",
    resolved: true,
  },
];

export const CONTACT_FACTS: Fact[] = [
  {id: "response", label: "Response", value: "Within 2 working days"},
  {id: "engagements", label: "Engagements", value: "Project · Retainer"},
  {id: "based", label: "Based", value: "Mumbai, India"},
  {id: "working", label: "Working with", value: "India · US · UK"},
];
