import { absoluteUrl, defaultDescription, siteName } from "@/lib/seo";

export function GET() {
  const body = [
    `# ${siteName}`,
    "",
    `> ${defaultDescription}`,
    "",
    "Primary audience: people and organizations looking for coaching, strategic consulting, classes, events, and digital products.",
    "",
    "Key URLs:",
    `- Home: ${absoluteUrl("/")}`,
    `- About: ${absoluteUrl("/about-me")}`,
    `- Classes: ${absoluteUrl("/classes")}`,
    `- Blog: ${absoluteUrl("/blog")}`,
    `- Store: ${absoluteUrl("/store")}`,
    `- Events: ${absoluteUrl("/events")}`,
    `- Bookings: ${absoluteUrl("/bookings")}`,
    `- Contact: ${absoluteUrl("/contact")}`,
    "",
    "Entity summary:",
    "- Brand: Shaman Life",
    "- Person: Burak Akcakanat",
    "- Location: Besiktas, Istanbul, Turkey",
    "- Services: coaching, strategic consulting, leadership development, Human Consciousness Decoded",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
