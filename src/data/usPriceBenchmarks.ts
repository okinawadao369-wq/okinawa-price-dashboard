import type { EvidenceQuality } from "./monitoringSources";

export type UsPriceBenchmark = {
  industryId: string;
  baseLow: number;
  baseHigh: number;
  quality: EvidenceQuality;
  sourceFamily: string;
  lastReviewed: string;
  rationale: string;
};

export const usPriceBenchmarks: UsPriceBenchmark[] = [
  { industryId: "ft_2d", baseLow: 75, baseHigh: 150, quality: "estimated", sourceFamily: "Elective 2D heartbeat/gender ultrasound listings and 2026 cost guides", lastReviewed: "2026-06-06", rationale: "Short 2D heartbeat/gender scans often price near $50-$125. FamilyTreeOki's private English-supported slot is valued above a quick scan, but below premium 4D bundles." },
  { industryId: "ft_4d", baseLow: 150, baseHigh: 450, quality: "estimated", sourceFamily: "WellAlly 2026 / CostInsightHub 2026 / public 3D-4D-HD ultrasound package menus", lastReviewed: "2026-06-09", rationale: "2026 public ranges show standard 3D/4D packages around $150-$350, premium HD/video/heartbeat-bear bundles around $250-$500+, and public boutique menus around $165-$269 with keepsakes. FamilyTreeOki's 1-hour private English-supported memory session should benchmark against the upper elective boutique experience, not a short quick scan." },
  { industryId: "ft_sitter_basic", baseLow: 21.75, baseHigh: 29.87, quality: "estimated", sourceFamily: "UrbanSitter 2026 national babysitting rates / Care.com 2026 cost-of-care nanny signal", lastReviewed: "2026-06-09", rationale: "Uses UrbanSitter 2026 one-child and two-child babysitting rates plus Care.com weekly nanny posting signal; Okinawa medical or infant work is evaluated separately." },
  { industryId: "ft_sitter_med", baseLow: 35, baseHigh: 95, quality: "estimated", sourceFamily: "2026 postpartum doula / night nurse / newborn care specialist public market ranges", lastReviewed: "2026-06-09", rationale: "Night doula, newborn care specialist, awake overnight care, and nurse-adjacent postpartum support commonly price above ordinary babysitting, with premium urban and medically experienced providers reaching the upper band." },
  { industryId: "cafe_latte", baseLow: 5, baseHigh: 8, quality: "estimated", sourceFamily: "2026 national coffee-chain and local cafe menu checks", lastReviewed: "2026-06-05", rationale: "Latte pricing remains a high-frequency dollar anchor; local cafes above $7 feel premium." },
  { industryId: "casual_lunch", baseLow: 12, baseHigh: 22, quality: "estimated", sourceFamily: "BLS food-away-from-home / public menu price checks", lastReviewed: "2026-06-05", rationale: "Fast casual and casual lunch checks commonly land in the low teens to low $20s before tip." },
  { industryId: "family_dinner", baseLow: 25, baseHigh: 50, quality: "estimated", sourceFamily: "BLS food-away-from-home / casual dining checks", lastReviewed: "2026-06-05", rationale: "Dinner per-person anchors should include entree, drink, tax, and tip psychology." },
  { industryId: "premium_dining", baseLow: 55, baseHigh: 110, quality: "estimated", sourceFamily: "U.S. premium dining menu checks / food-away-from-home CPI", lastReviewed: "2026-06-05", rationale: "Premium dinner is treated as an occasion purchase for officers, GS, PCS memory, and visiting family." },
  { industryId: "house_cleaning", baseLow: 35, baseHigh: 75, quality: "estimated", sourceFamily: "Housecall Pro / HomeGuide 2026 cleaning cost guides", lastReviewed: "2026-06-05", rationale: "Professional residential cleaning is generally priced per cleaner-hour, with insured providers higher." },
  { industryId: "car_detail", baseLow: 150, baseHigh: 350, quality: "estimated", sourceFamily: "2026 auto detailing full-detail price guides", lastReviewed: "2026-06-09", rationale: "PCS resale and inspection prep is closer to full interior-and-exterior detailing than a simple wash; 2026 public guides commonly place full detail packages around $150-$400." },
  { industryId: "pet_sitting", baseLow: 20, baseHigh: 50, quality: "estimated", sourceFamily: "Rover/Wag signals and 2026 pet-sitting cost guides", lastReviewed: "2026-06-05", rationale: "Drop-in visit pricing varies by city, pets, and holiday timing; overnight care is excluded from this unit." },
  { industryId: "translation_admin", baseLow: 45, baseHigh: 100, quality: "estimated", sourceFamily: "Federal/state interpreter rate schedules and language-service ranges", lastReviewed: "2026-06-05", rationale: "Hospital, admin, and legal-adjacent interpretation requires reliability and scheduling, not only translation time." },
  { industryId: "hair_color_women", baseLow: 120, baseHigh: 350, quality: "estimated", sourceFamily: "2026 haircut/color and salon service cost guides", lastReviewed: "2026-06-05", rationale: "Cut plus color or highlight/balayage has a wide range; high-cost metros can exceed this." },
  { industryId: "massage_60", baseLow: 70, baseHigh: 150, quality: "estimated", sourceFamily: "2026 massage cost guides", lastReviewed: "2026-06-05", rationale: "Uses standard 60-minute clinic/spa massage pricing, excluding luxury resort add-ons." },
  { industryId: "acupuncture", baseLow: 75, baseHigh: 150, quality: "estimated", sourceFamily: "2026 acupuncture session cost guides / clinic price lists", lastReviewed: "2026-06-09", rationale: "2026 public cost guides commonly place a standard acupuncture session around $75-$150; first-visit consultation premiums are excluded from this recurring-session anchor." },
  { industryId: "baby_keepsake", baseLow: 35, baseHigh: 80, quality: "estimated", sourceFamily: "Heartbeat plush / heartbeat animal add-on public boutique listings", lastReviewed: "2026-06-09", rationale: "Heartbeat animal add-ons commonly appear around $35-$45 as standalone add-ons, while bundled keepsake packages with jewelry, prints, digital delivery, and ultrasound time reach higher effective values." },
  { industryId: "baby_maternity_retail", baseLow: 25, baseHigh: 90, quality: "estimated", sourceFamily: "Baby/maternity public retail price checks", lastReviewed: "2026-06-05", rationale: "This is a basket anchor; brand trust and English explanation matter more than one exact SKU." },
  { industryId: "family_photo", baseLow: 300, baseHigh: 900, quality: "estimated", sourceFamily: "2026 family/newborn photography price guides", lastReviewed: "2026-06-05", rationale: "Newborn and family sessions with editing are materially higher than mini-session entry products." },
  { industryId: "mini_photo", baseLow: 175, baseHigh: 350, quality: "estimated", sourceFamily: "2026 portrait mini-session public pricing", lastReviewed: "2026-06-05", rationale: "Mini sessions are entry products and should not be compared with full newborn packages." },
  { industryId: "tour_activity", baseLow: 60, baseHigh: 160, quality: "estimated", sourceFamily: "U.S. half-day tour/activity public price checks", lastReviewed: "2026-06-05", rationale: "Per-person family-safe guided activity pricing includes safety briefing and English support value." },
  { industryId: "language_lesson", baseLow: 25, baseHigh: 80, quality: "estimated", sourceFamily: "2026 private tutoring / ESL language lesson cost guides", lastReviewed: "2026-06-05", rationale: "Language lessons are treated as one-to-one tutoring; specialized test prep is excluded." }
];

export function benchmarkForIndustry(industryId: string) {
  return usPriceBenchmarks.find((item) => item.industryId === industryId);
}
