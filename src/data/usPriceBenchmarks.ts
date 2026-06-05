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
  { industryId: "ft_2d", baseLow: 150, baseHigh: 215, quality: "estimated", sourceFamily: "Elective ultrasound package listings / 2026 cost guides", lastReviewed: "2026-06-05", rationale: "Private 1-hour Okinawa session is compared against standard or premium elective scan packages, not only short 5-15 minute checks." },
  { industryId: "ft_4d", baseLow: 150, baseHigh: 265, quality: "estimated", sourceFamily: "Elective 3D/4D boutique ultrasound packages", lastReviewed: "2026-06-05", rationale: "2026 public ranges commonly show standard 3D/4D packages around $100-$250 and premium keepsake bundles up to the low $300s." },
  { industryId: "ft_sitter_basic", baseLow: 21.75, baseHigh: 29.87, quality: "estimated", sourceFamily: "UrbanSitter 2026 / Care.com 2026 cost-of-care signals", lastReviewed: "2026-06-05", rationale: "Uses 2026 national one-child babysitting and nanny-rate signals; Okinawa medical or infant work is evaluated separately." },
  { industryId: "ft_sitter_med", baseLow: 35, baseHigh: 85, quality: "estimated", sourceFamily: "Premium infant care / nurse-adjacent postpartum care public market ranges", lastReviewed: "2026-06-05", rationale: "Newborn, night, medical-adjacent, and postpartum support carries a premium above ordinary babysitting." },
  { industryId: "cafe_latte", baseLow: 5, baseHigh: 8, quality: "estimated", sourceFamily: "2026 national coffee-chain and local cafe menu checks", lastReviewed: "2026-06-05", rationale: "Latte pricing remains a high-frequency dollar anchor; local cafes above $7 feel premium." },
  { industryId: "casual_lunch", baseLow: 12, baseHigh: 22, quality: "estimated", sourceFamily: "BLS food-away-from-home / public menu price checks", lastReviewed: "2026-06-05", rationale: "Fast casual and casual lunch checks commonly land in the low teens to low $20s before tip." },
  { industryId: "family_dinner", baseLow: 25, baseHigh: 50, quality: "estimated", sourceFamily: "BLS food-away-from-home / casual dining checks", lastReviewed: "2026-06-05", rationale: "Dinner per-person anchors should include entree, drink, tax, and tip psychology." },
  { industryId: "premium_dining", baseLow: 55, baseHigh: 110, quality: "estimated", sourceFamily: "U.S. premium dining menu checks / food-away-from-home CPI", lastReviewed: "2026-06-05", rationale: "Premium dinner is treated as an occasion purchase for officers, GS, PCS memory, and visiting family." },
  { industryId: "house_cleaning", baseLow: 35, baseHigh: 75, quality: "estimated", sourceFamily: "Housecall Pro / HomeGuide 2026 cleaning cost guides", lastReviewed: "2026-06-05", rationale: "Professional residential cleaning is generally priced per cleaner-hour, with insured providers higher." },
  { industryId: "car_detail", baseLow: 120, baseHigh: 300, quality: "estimated", sourceFamily: "2026 auto detailing price guides", lastReviewed: "2026-06-05", rationale: "PCS resale and inspection prep is closer to standard/full detailing than a simple wash." },
  { industryId: "pet_sitting", baseLow: 20, baseHigh: 50, quality: "estimated", sourceFamily: "Rover/Wag signals and 2026 pet-sitting cost guides", lastReviewed: "2026-06-05", rationale: "Drop-in visit pricing varies by city, pets, and holiday timing; overnight care is excluded from this unit." },
  { industryId: "translation_admin", baseLow: 45, baseHigh: 100, quality: "estimated", sourceFamily: "Federal/state interpreter rate schedules and language-service ranges", lastReviewed: "2026-06-05", rationale: "Hospital, admin, and legal-adjacent interpretation requires reliability and scheduling, not only translation time." },
  { industryId: "hair_color_women", baseLow: 120, baseHigh: 350, quality: "estimated", sourceFamily: "2026 haircut/color and salon service cost guides", lastReviewed: "2026-06-05", rationale: "Cut plus color or highlight/balayage has a wide range; high-cost metros can exceed this." },
  { industryId: "massage_60", baseLow: 70, baseHigh: 150, quality: "estimated", sourceFamily: "2026 massage cost guides", lastReviewed: "2026-06-05", rationale: "Uses standard 60-minute clinic/spa massage pricing, excluding luxury resort add-ons." },
  { industryId: "acupuncture", baseLow: 65, baseHigh: 150, quality: "estimated", sourceFamily: "2026 acupuncture session cost guides / clinic price lists", lastReviewed: "2026-06-05", rationale: "Follow-up and 60-minute sessions are separated from first-visit consultation premiums." },
  { industryId: "baby_keepsake", baseLow: 35, baseHigh: 80, quality: "estimated", sourceFamily: "Heartbeat plush / keepsake add-on public listings", lastReviewed: "2026-06-05", rationale: "Keepsake pricing is evaluated as an ultrasound-session add-on, not a standalone toy." },
  { industryId: "baby_maternity_retail", baseLow: 25, baseHigh: 90, quality: "estimated", sourceFamily: "Baby/maternity public retail price checks", lastReviewed: "2026-06-05", rationale: "This is a basket anchor; brand trust and English explanation matter more than one exact SKU." },
  { industryId: "family_photo", baseLow: 300, baseHigh: 900, quality: "estimated", sourceFamily: "2026 family/newborn photography price guides", lastReviewed: "2026-06-05", rationale: "Newborn and family sessions with editing are materially higher than mini-session entry products." },
  { industryId: "mini_photo", baseLow: 175, baseHigh: 350, quality: "estimated", sourceFamily: "2026 portrait mini-session public pricing", lastReviewed: "2026-06-05", rationale: "Mini sessions are entry products and should not be compared with full newborn packages." },
  { industryId: "tour_activity", baseLow: 60, baseHigh: 160, quality: "estimated", sourceFamily: "U.S. half-day tour/activity public price checks", lastReviewed: "2026-06-05", rationale: "Per-person family-safe guided activity pricing includes safety briefing and English support value." },
  { industryId: "language_lesson", baseLow: 25, baseHigh: 80, quality: "estimated", sourceFamily: "2026 private tutoring / ESL language lesson cost guides", lastReviewed: "2026-06-05", rationale: "Language lessons are treated as one-to-one tutoring; specialized test prep is excluded." }
];

export function benchmarkForIndustry(industryId: string) {
  return usPriceBenchmarks.find((item) => item.industryId === industryId);
}
