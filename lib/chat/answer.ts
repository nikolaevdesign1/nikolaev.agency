import { bestCases } from "@/lib/data/best-cases";
import { projects, type Project } from "@/lib/data/projects";
import { directions, type Direction } from "@/lib/data/services";
import { site } from "@/lib/data/site";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const FIELD_ORDER = ["who", "reach", "making", "timing", "need"] as const;
type Field = (typeof FIELD_ORDER)[number];

type Brief = Record<Field, string | null> & { started: boolean };

const FIELD_ASK: Record<Field, string> = {
  who: "Who should this be addressed to — your name, and a company if you have one?",
  reach: "How should the studio reach you? An email is enough.",
  making: "What are you making?",
  timing: "What's the timing — a date, a season, or still open?",
  need: "What do you need from the studio?",
};

const FIELD_LABEL: Record<Field, string> = {
  who: "who you are",
  reach: "how to reach you",
  making: "what you're making",
  timing: "the timing",
  need: "what you need",
};

const OFFER =
  "If you want to start a project, say so and I'll collect a short brief and draft the inquiry. I won't send it.";

const INQUIRY =
  /\b(start(?:ing)?(?:\s+a|\s+the)?(?:\s+new)?\s+project|new project|hire|work with you|work together|write (?:an |the )?(?:inquir\w*|brief|message)|draft (?:an |the )?(?:inquir\w*|brief|message)|project brief|get in touch|reach out|collaborate|proposal|quote)\b/i;

const SUBMIT =
  /\b(submit(?:\s+the|\s+this|\s+it)?|send (?:it|this|the form|the inquiry|the message)|email (?:it|them|this) for me)\b/i;

const SERVICE_ALIASES: Record<string, string[]> = {
  "Brand Identity": ["brand identity", "brand", "identity", "logo", "naming"],
  "Product Design": ["product design"],
  "UI / UX": ["ui / ux", "ui/ux", "user interface", "user experience", "ui", "ux"],
  "Functional Research": ["functional research", "user research", "research"],
  Wireframing: ["wireframe", "wireframes", "wireframing"],
  "Motion & Dynamics": ["motion", "animation", "micro-interaction"],
  "Front-end Development": ["front-end", "frontend", "front end"],
  "Design Systems": ["design system", "design systems"],
  "AI Integration": ["ai integration", "agent-native"],
  "Art Direction": ["art direction"],
  Accessibility: ["accessibility", "a11y"],
  "Content Architecture": ["content architecture", "information architecture"],
};

function emptyBrief(): Brief {
  return {
    who: null,
    reach: null,
    making: null,
    timing: null,
    need: null,
    started: false,
  };
}

function clip(text: string, max = 400) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

function hasPhrase(text: string, phrase: string) {
  const escape = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escape}([^a-z0-9]|$)`, "i").test(text);
}

function isQuestion(text: string) {
  const trimmed = text.trim();
  if (trimmed.endsWith("?")) return true;
  return /^(what|who|where|when|why|how|do you|can you|could you|would you|tell me|show me|are you|is there|have you|did you)\b/i.test(
    trimmed,
  );
}

function affirmsBrief(text: string, previousAssistant: string | null) {
  if (!previousAssistant?.includes(OFFER)) return false;
  if (isQuestion(text)) return false;
  return /^(yes|yeah|yep|sure|ok|okay|please|let's|lets|start)\b/i.test(
    text.trim(),
  );
}

function askedField(content: string): Field | null {
  for (const field of FIELD_ORDER) {
    if (content.includes(FIELD_ASK[field])) return field;
  }
  return null;
}

function emailIn(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
}

function timingIn(text: string) {
  const match = text.match(
    /\b(as soon as possible|asap|no rush|still open|timing is open|flexible|next (?:week|month|quarter|year|spring|summer|fall|autumn|winter)|this (?:week|month|quarter|year|spring|summer|fall|autumn|winter)|(?:in|within) \d+ (?:days|weeks|months)|q[1-4](?:\s+\d{4})?|(?:spring|summer|fall|autumn|winter)(?:\s+\d{4})?|20\d{2})\b/i,
  );
  return match?.[0] ?? null;
}

function mentionedServices(text: string) {
  return directions.filter((direction) => {
    if (hasPhrase(text, direction.label)) return true;
    const aliases = SERVICE_ALIASES[direction.label] ?? [];
    return aliases.some((alias) => hasPhrase(text, alias));
  });
}

function absorb(brief: Brief, text: string, pending: Field | null) {
  const email = emailIn(text);
  if (email) brief.reach = email;

  const name = text.match(
    /\b(?:i['’]?m|i am|my name is|this is)\s+([^,.\n]{2,80})/i,
  );
  if (name && pending !== "who") brief.who = clip(name[1], 120);

  const making = text.match(
    /\b(?:making|building|launching|working on)\s+([^.\n]{3,180})/i,
  );
  if (making && pending !== "making") brief.making = clip(making[1], 240);

  const explicitTiming = text.match(
    /\b(?:timing|deadline)(?:\s+is|:)?\s+([^.\n]{2,80})/i,
  );
  const timing = explicitTiming?.[1] ?? (pending === "timing" ? null : timingIn(text));
  if (timing && pending !== "timing") brief.timing = clip(timing, 80);

  const services = mentionedServices(text);
  if (services.length && pending !== "need" && /\b(need|looking for|want)\b/i.test(text)) {
    brief.need = services.map((service) => service.label).join(", ");
  }

  if (pending && !isQuestion(text)) {
    if (pending === "reach" && email) brief.reach = email;
    else if (pending === "timing") brief.timing = clip(explicitTiming?.[1] ?? timingIn(text) ?? text, 120);
    else brief[pending] = clip(text);
  }
}

function collectBrief(messages: ChatTurn[]): Brief {
  const brief = emptyBrief();
  let pending: Field | null = null;
  let previousAssistant: string | null = null;

  for (const message of messages) {
    if (message.role === "assistant") {
      pending = askedField(message.content);
      previousAssistant = message.content;
      continue;
    }

    const text = message.content.trim();
    if (
      INQUIRY.test(text) ||
      affirmsBrief(text, previousAssistant) ||
      pending !== null
    ) {
      brief.started = true;
    }
    absorb(brief, text, pending);
    if (FIELD_ORDER.some((field) => brief[field])) brief.started = true;
    pending = null;
  }

  return brief;
}

function matchProject(text: string): Project | null {
  let best: { project: Project; score: number } | null = null;
  for (const project of projects) {
    const terms = [project.title, project.client, project.slug.replace(/-/g, " ")];
    for (const term of terms) {
      if (term.length < 3 || !hasPhrase(text, term)) continue;
      if (!best || term.length > best.score) best = { project, score: term.length };
    }
  }
  return best?.project ?? null;
}

function matchBestCase(text: string) {
  let best: { name: string; score: number } | null = null;
  for (const item of bestCases) {
    if (!hasPhrase(text, item.name)) continue;
    if (!best || item.name.length > best.score) best = { name: item.name, score: item.name.length };
  }
  return best?.name ?? null;
}

function projectDetail(project: Project) {
  return `${project.title} (${project.year}) is a ${project.category.toLowerCase()} project for ${project.client}. ${project.summary} Services named on the project: ${project.services.join(", ")}. The project page says the full case study is coming soon.`;
}

function workOverview() {
  const index = projects
    .map((project) => `${project.title} (${project.year}) for ${project.client}`)
    .join("; ");
  const names = bestCases.map((item) => item.name).join(", ");
  return `The project index has written summaries for ${projects.length} projects: ${index}. Each project page says the full case study is coming soon. Ask for a name and I can read that summary. The homepage also lists ${names} under Best cases, with no written summary, year, or services.`;
}

function servicesOverview() {
  const labels = directions.map((direction) => direction.label).join(", ");
  return `${site.description} The site lists these directions: ${labels}. Ask about one for the lines published under it.`;
}

function serviceDetail(direction: Direction) {
  return `${direction.label}: ${direction.bullets.join(" ")}`;
}

function aboutAnswer() {
  return `${site.legalName} is based in ${site.location} and was established in ${site.founded}. ${site.description} ${site.tagline} The about page opens with “A studio built for founders who care about craft.” and says the studio works with early-stage and growth companies who need a brand and product presence that can actually ship. It also says the full page — team, process, and principles — is coming soon. The navigation credits the site to Oleg Nikolaev. The footer says it was designed and built in Los Angeles.`;
}

function contactAnswer() {
  const social = site.social
    .map((item) => `${item.label} (${item.href})`)
    .join(", ");
  return `Email ${site.email}. The site doesn't list a phone number or a street address. The contact form asks for a name, an email, an optional reason (new project, existing product, ongoing design support, job opportunity, or something else), and what you have in mind. Its confirmation says the studio replies to every inquiry within two business days. Social links: ${social}.`;
}

function factualReply(text: string, inBrief: boolean) {
  if (/^(hi|hey|hello|good (?:morning|afternoon|evening))\b/i.test(text.trim()) && !isQuestion(text)) {
    return `Hello. ${aboutAnswer()}`;
  }

  const seeking =
    isQuestion(text) || /^(tell me|show me|describe)\b/i.test(text.trim());
  if ((inBrief || INQUIRY.test(text)) && !seeking) return null;
  if (
    !seeking &&
    !/\b(price|pricing|cost|costs|award|awards|timeline|services|portfolio)\b/i.test(text)
  ) {
    return null;
  }

  const bits: string[] = [];
  const lower = text.toLowerCase();
  const project = matchProject(text);
  const best = matchBestCase(text);
  const namedServices = mentionedServices(text);

  if (/\b(price|pricing|cost|costs|rate|rates|budget|how much|fee|fees)\b/.test(lower)) {
    bits.push(
      "Pricing isn't published on the site, and the contact form doesn't collect a budget.",
    );
  }
  if (/\b(award|awards|prize|prizes|winner|recognition)\b/.test(lower)) {
    bits.push("The site doesn't list awards.");
  }
  if (/\b(team|founder|who (?:runs|founded|works)|oleg|biography|bio)\b/.test(lower)) {
    bits.push(
      "The about page says the full page — team, process, and principles — is coming soon. The navigation credits the site to Oleg Nikolaev. There isn't a team roster or a biography beyond that.",
    );
  }
  if (
    /\b(timeline|how long|turnaround|process|schedule)\b/.test(lower) &&
    !/\b(timing|deadline)\b/.test(lower)
  ) {
    bits.push(
      "The site doesn't publish project timelines or a process schedule. The about page says that page is coming soon. The contact form's confirmation says the studio replies to every inquiry within two business days.",
    );
  }
  if (/\b(job|jobs|hiring|career|work here|open role)\b/.test(lower)) {
    bits.push(
      "The contact form includes “Job opportunity” as a reason. The site doesn't list open roles.",
    );
  }
  if (/\b(available|availability|taking on|booked)\b/.test(lower)) {
    bits.push("The site doesn't say whether the studio is taking on work right now.");
  }

  if (project) bits.push(projectDetail(project));
  else if (best) {
    bits.push(
      `${best} is listed under Best cases on the homepage. The site doesn't include a written summary, client, year, or services for it.`,
    );
  } else if (
    /\b(recent work|your work|the work|what work|case stud|portfolio|projects|what have you|shipped|show me|clients?|best cases)\b/i.test(
      text,
    )
  ) {
    bits.push(workOverview());
  }

  if (namedServices.length > 0 && namedServices.length < directions.length) {
    bits.push(namedServices.map(serviceDetail).join("\n\n"));
  } else if (
    /\b(services?|what do you do|what does (?:the studio|nikolaev)|capabilities|directions)\b/i.test(
      text,
    )
  ) {
    bits.push(servicesOverview());
  }

  if (/\b(where|based|location|los angeles|address|office)\b/i.test(text)) {
    bits.push(
      `The studio is in ${site.location}. It was established in ${site.founded}, and the footer says it was designed and built in Los Angeles. A street address isn't published.`,
    );
  }
  if (
    /\b(your email|email you|contact you|phone number|how (?:do|can|to) (?:i|we) (?:reach|contact)|social|instagram|linkedin)\b/i.test(
      text,
    ) ||
    (seeking && /\b(email|e-mail|contact|phone)\b/i.test(text))
  ) {
    bits.push(contactAnswer());
  }
  if (
    bits.length === 0 &&
    /\b(about|who are you|who is nikolaev|founded|established|when (?:did|was))\b/i.test(
      text,
    )
  ) {
    bits.push(aboutAnswer());
  }
  return bits.length ? bits.join("\n\n") : null;
}

function draftInquiry(brief: Brief) {
  const who = brief.who ?? "";
  const reach = brief.reach ?? "";
  const making = brief.making ?? "";
  const timing = brief.timing ?? "";
  const need = brief.need ?? "";
  const letter = `Hello — ${who}. Reach me at ${reach}. We're making ${making}. Timing: ${timing}. What we need: ${need}.`;

  return [
    "Here's a draft inquiry. It has not been submitted.",
    `Name / company: ${who}`,
    `Reach: ${reach}`,
    `Making: ${making}`,
    `Timing: ${timing}`,
    `Need: ${need}`,
    "",
    letter,
    "",
    `Send it yourself at /contact — the form wants a name, an email, and the message — or email ${site.email}. The site says the studio replies within two business days. I won't submit the form.`,
  ].join("\n");
}

function nextMissing(brief: Brief): Field | null {
  return FIELD_ORDER.find((field) => !brief[field]) ?? null;
}

function changed(prior: Brief, brief: Brief) {
  return FIELD_ORDER.some((field) => prior[field] !== brief[field]);
}

/**
 * Answers from published site copy only. No remote model is called.
 * Collects a brief and drafts an inquiry without submitting the contact form.
 */
export function answerFromSite(messages: ChatTurn[]): string {
  const latest = messages.filter((message) => message.role === "user").at(-1)?.content.trim() ?? "";
  if (!latest) {
    return "Ask a question about the studio, or say you'd like to start a project.";
  }

  const prior = collectBrief(messages.slice(0, -1));
  const brief = collectBrief(messages);
  const factual = factualReply(latest, prior.started);
  const missing = nextMissing(brief);
  const complete = missing === null;
  const parts: string[] = [];

  if (SUBMIT.test(latest)) {
    parts.push("I don't submit the contact form.");
  }

  if (factual) parts.push(factual);

  if (brief.started) {
    if (!complete && missing) {
      const opening =
        !prior.started && !factual
          ? "I can collect a short brief — who you are, how to reach you, what you're making, the timing, and what you need — and draft the inquiry. I won't send it."
          : null;
      if (opening) parts.push(opening);
      parts.push(FIELD_ASK[missing]);
    } else if (
      complete &&
      (changed(prior, brief) ||
        !FIELD_ORDER.every((field) => prior[field]) ||
        /\b(draft|inquiry|rewrite|revise)\b/i.test(latest) ||
        SUBMIT.test(latest))
    ) {
      parts.push(draftInquiry(brief));
    }
  }

  const firstReply = messages.every((message) => message.role === "user");
  if (!brief.started && factual && firstReply) {
    parts.push(OFFER);
  }

  if (parts.length === 0) {
    if (complete && brief.started) {
      parts.push(
        "The draft above is ready whenever you want to send it yourself. I won't submit the form. Tell me if a line should change.",
      );
    } else if (brief.started && missing) {
      parts.push(FIELD_ASK[missing]);
    } else {
      parts.push(
        "That isn't in the site content I can use. I can talk about the studio, the services, the written projects, or help you draft an inquiry. I won't invent awards, prices, or clients, and I won't send the contact form.",
      );
    }
  }

  return parts.join("\n\n");
}
