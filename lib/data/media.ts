export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "image"; src: string; alt: string };

export type SocialMirror = { label: "LinkedIn" | "Twitter" | "Substack"; href: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readMinutes: number;
  cover: string;
  excerpt: string;
  content: ArticleBlock[];
  socials: SocialMirror[];
};

export const articles: Article[] = [
  {
    slug: "agent-native-interfaces",
    title: "Designing interfaces for agents, not just users",
    description:
      "Why product teams shipping in 2026 need to design for both a human and a model reading the same screen.",
    category: "AI",
    date: "2026-11-02",
    readMinutes: 7,
    cover: "https://picsum.photos/seed/media-agent-native/1600/1000",
    excerpt:
      "A growing share of traffic hitting your product isn't a person clicking — it's a model reading. Designing for both audiences at once changes more than you'd think.",
    content: [
      {
        type: "p",
        text: "A growing share of traffic hitting your product isn't a person clicking — it's a model reading. Designing for both audiences at once changes more than you'd think.",
      },
      { type: "h2", text: "The second reader" },
      {
        type: "p",
        text: "Every interface now has two readers: the person looking at the screen, and the agent parsing the DOM, the API response, or the screenshot on their behalf. **Most teams still design for one.**",
      },
      {
        type: "image",
        src: "https://picsum.photos/seed/media-agent-1/1400/900",
        alt: "Wireframe overlay showing a UI annotated for both human and agent readers",
      },
      {
        type: "p",
        text: "The fix isn't a separate API for agents — it's making the *same* interface legible to both. Clear labels over icon-only buttons. Structured data that mirrors the visual hierarchy. States that are inferable from markup, not just from a color change.",
      },
      { type: "h2", text: "What actually changes" },
      {
        type: "p",
        text: "In practice: semantic HTML stops being a nice-to-have, forms get real labels instead of placeholder text standing in for them, and error states say what happened instead of just turning red. None of this is new advice — it's **accessibility work with a new audience**.",
      },
      {
        type: "p",
        text: "The teams getting this right aren't building a parallel product for agents. They're finishing the product they already had.",
      },
    ],
    socials: [
      { label: "LinkedIn", href: "https://linkedin.com/pulse/agent-native-interfaces" },
      { label: "Twitter", href: "https://x.com/nikolaevdesign/status/0000000001" },
      { label: "Substack", href: "https://nikolaev.substack.com/p/agent-native-interfaces" },
    ],
  },
  {
    slug: "pricing-pages-for-models",
    title: "Your pricing page is being read by a model before a person sees it",
    description:
      "AI shopping agents are shortlisting vendors from pricing pages. Here's what that means for how you write one.",
    category: "Strategy",
    date: "2026-10-24",
    readMinutes: 5,
    cover: "https://picsum.photos/seed/media-pricing/1600/1000",
    excerpt:
      "Before a buyer ever opens your pricing page, an agent may have already decided whether you're on the shortlist.",
    content: [
      {
        type: "p",
        text: "Before a buyer ever opens your pricing page, an agent may have already decided whether you're on the shortlist. That decision is made from whatever text and structure the page actually contains — not the marketing copy layered on top.",
      },
      { type: "h2", text: "What agents can't infer" },
      {
        type: "p",
        text: "A price buried in a gradient hero image. A tier comparison rendered entirely in a canvas chart. A \"contact us\" button standing in for a number that exists somewhere in a sales deck. *All of these work fine for a person who scrolls and squints. None of them work for an agent.*",
      },
      {
        type: "p",
        text: "The fix is almost boringly simple: put the number in text, in a table, with a plain-language unit attached.",
      },
    ],
    socials: [
      { label: "LinkedIn", href: "https://linkedin.com/pulse/pricing-pages-for-models" },
      { label: "Substack", href: "https://nikolaev.substack.com/p/pricing-pages-for-models" },
    ],
  },
  {
    slug: "direct-access-model",
    title: "Why we never hired an account manager",
    description:
      "Five years into running a small studio without a single account manager on staff — what that trade-off actually costs, and what it buys back.",
    category: "Studio",
    date: "2026-10-12",
    readMinutes: 6,
    cover: "https://picsum.photos/seed/media-direct-access/1600/1000",
    excerpt:
      "Every account manager we didn't hire is a conversation that didn't get relayed through a third person.",
    content: [
      {
        type: "p",
        text: "Every account manager we didn't hire is a conversation that didn't get relayed through a third person. That's the whole pitch, and it's also the whole constraint: it caps how many projects we can run at once.",
      },
      { type: "h2", text: "The real cost" },
      {
        type: "p",
        text: "Clients reach the person writing the code and drawing the pixels, every time. **No handoff, no summary, no telephone game.** The cost is that we say no to work more often than a bigger shop would.",
      },
      {
        type: "p",
        text: "We've made peace with that. A smaller list of clients who get the actual team, instead of a bigger list routed through people who weren't in the room.",
      },
    ],
    socials: [{ label: "LinkedIn", href: "https://linkedin.com/pulse/direct-access-model" }],
  },
  {
    slug: "schema-before-pixels",
    title: "Schema before pixels: structuring content before a single page is built",
    description:
      "A content model decided after launch is a redesign waiting to happen. Here's the order we actually work in.",
    category: "Process",
    date: "2026-09-29",
    readMinutes: 8,
    cover: "https://picsum.photos/seed/media-schema/1600/1000",
    excerpt:
      "The fastest way to guarantee a redesign in eighteen months is to decide the content model after the visual design is done.",
    content: [
      {
        type: "p",
        text: "The fastest way to guarantee a redesign in eighteen months is to decide the content model after the visual design is done. We've stopped doing that, and the projects that stuck are the ones where schema came first.",
      },
      { type: "h2", text: "What comes first" },
      {
        type: "p",
        text: "Before a single mockup: what fields does a case study actually need, what's optional, what's computed. The *hard* fields — the ones a client's editor will fight with six months in — get decided while the stakes are low.",
      },
    ],
    socials: [
      { label: "LinkedIn", href: "https://linkedin.com/pulse/schema-before-pixels" },
      { label: "Twitter", href: "https://x.com/nikolaevdesign/status/0000000002" },
    ],
  },
  {
    slug: "motion-that-explains-state",
    title: "Motion that explains state, not motion that decorates it",
    description:
      "Most micro-interactions are decoration. The ones worth shipping tell the user something they'd otherwise have to guess.",
    category: "Design",
    date: "2026-09-14",
    readMinutes: 4,
    cover: "https://picsum.photos/seed/media-motion/1600/1000",
    excerpt:
      "A good transition answers a question the interface would otherwise leave open: where did that go, what caused this, is it still loading.",
    content: [
      {
        type: "p",
        text: "A good transition answers a question the interface would otherwise leave open: where did that go, what caused this, is it still loading. A bad one just moves for the sake of moving.",
      },
      {
        type: "p",
        text: "**Test for this directly:** turn the animation off. If the interface is harder to understand with it gone, it was explaining something. If nothing changes, it was decoration.",
      },
    ],
    socials: [{ label: "Substack", href: "https://nikolaev.substack.com/p/motion-that-explains-state" }],
  },
  {
    slug: "small-team-ceiling",
    title: "The real ceiling on a five-person studio isn't talent",
    description: "It's context-switching. Here's how we protect focus without growing headcount.",
    category: "Studio",
    date: "2026-08-30",
    readMinutes: 5,
    cover: "https://picsum.photos/seed/media-ceiling/1600/1000",
    excerpt: "Five people can design and build more than you'd guess — as long as they're not switching projects every ninety minutes.",
    content: [
      {
        type: "p",
        text: "Five people can design and build more than you'd guess — as long as they're not switching projects every ninety minutes. The ceiling on a small studio is rarely skill. It's how many open loops each person is carrying at once.",
      },
      { type: "h2", text: "What we protect" },
      {
        type: "p",
        text: "One active project per person, most weeks. It means saying no earlier than feels comfortable, and it's the single biggest reason the work doesn't slip.",
      },
    ],
    socials: [{ label: "LinkedIn", href: "https://linkedin.com/pulse/small-team-ceiling" }],
  },
  {
    slug: "when-to-rebuild-not-redesign",
    title: "When the right move is a rebuild, not a redesign",
    description:
      "A visual refresh can't fix a content model that's fighting the team using it. Signs it's time for the bigger job.",
    category: "Strategy",
    date: "2026-08-11",
    readMinutes: 6,
    cover: "https://picsum.photos/seed/media-rebuild/1600/1000",
    excerpt: "If every new page needs a developer because the template can't flex, that's not a visual problem.",
    content: [
      {
        type: "p",
        text: "If every new page needs a developer because the template can't flex, that's not a visual problem — new type and color won't touch it.",
      },
      {
        type: "p",
        text: "The tell is almost always the same: the team describes workarounds, not workflows. *\"We duplicate that page and edit the copy\"* is a content model problem wearing a design complaint.",
      },
    ],
    socials: [
      { label: "LinkedIn", href: "https://linkedin.com/pulse/when-to-rebuild-not-redesign" },
      { label: "Substack", href: "https://nikolaev.substack.com/p/when-to-rebuild-not-redesign" },
    ],
  },
];

export function articleCategories() {
  return Array.from(new Set(articles.map((a) => a.category))).sort();
}

export function latestArticle() {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function otherArticles() {
  const latest = latestArticle();
  return articles.filter((a) => a.slug !== latest.slug).sort((a, b) => b.date.localeCompare(a.date));
}
