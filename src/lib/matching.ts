import type { Dog, AdopterPreferences, MatchResult } from "@/types";

const WEIGHTS = {
  energy: 25,
  size: 15,
  age: 10,
  kids_safe: 20,
  pets_safe: 15,
  experience: 10,
  housing: 10,
  fee: 5,
  time_listed: 5,
};

function energyScore(dog: Dog, prefs: AdopterPreferences): number {
  const map: Record<string, string> = {
    "very active": "high",
    active: "high",
    moderate: "moderate",
    "moderately active": "moderate",
    relaxed: "low",
    "low energy": "low",
  };

  const preferred = map[(prefs.activity_level ?? "").toLowerCase()] ?? null;
  if (!preferred) return WEIGHTS.energy * 0.5;
  if (dog.energy_level === preferred) return WEIGHTS.energy;
  if (preferred === "moderate" || dog.energy_level === "moderate")
    return WEIGHTS.energy * 0.5;
  return 0;
}

function sizeScore(dog: Dog, prefs: AdopterPreferences): number {
  if (!prefs.size_preference) return WEIGHTS.size;
  return dog.size === prefs.size_preference ? WEIGHTS.size : 0;
}

function ageScore(dog: Dog, prefs: AdopterPreferences): number {
  if (!prefs.age_preference) return WEIGHTS.age;

  const totalMonths = (dog.age_years ?? 0) * 12 + (dog.age_months ?? 0);
  const ageCategory =
    totalMonths < 12
      ? "puppy"
      : totalMonths < 36
        ? "young"
        : totalMonths < 84
          ? "adult"
          : "senior";

  const prefMap: Record<string, string> = {
    puppy: "puppy",
    "young adult": "young",
    adult: "adult",
    senior: "senior",
  };
  const wanted = prefMap[prefs.age_preference.toLowerCase()] ?? null;
  if (!wanted) return WEIGHTS.age * 0.5;
  return ageCategory === wanted ? WEIGHTS.age : 0;
}

function kidsSafetyScore(dog: Dog, prefs: AdopterPreferences): number {
  if (!prefs.has_kids) return WEIGHTS.kids_safe;
  if (dog.good_with_kids === false) return -WEIGHTS.kids_safe;
  if (dog.good_with_kids === true) return WEIGHTS.kids_safe;
  return WEIGHTS.kids_safe * 0.3;
}

function petsSafetyScore(dog: Dog, prefs: AdopterPreferences): number {
  let score = 0;
  const max = WEIGHTS.pets_safe;

  if (!prefs.has_dogs && !prefs.has_cats) return max;

  if (prefs.has_dogs) {
    if (dog.good_with_dogs === false) score -= max * 0.6;
    else if (dog.good_with_dogs === true) score += max * 0.5;
  }

  if (prefs.has_cats) {
    if (dog.good_with_cats === false) score -= max * 0.6;
    else if (dog.good_with_cats === true) score += max * 0.5;
  }

  return Math.max(-max, Math.min(max, score));
}

function experienceScore(dog: Dog, prefs: AdopterPreferences): number {
  const isFirstTime =
    prefs.experience_level?.toLowerCase().includes("first") ?? false;

  if (!isFirstTime) return WEIGHTS.experience;

  if (
    dog.energy_level === "high" &&
    dog.size === "large" &&
    dog.good_with_dogs === false
  ) {
    return -WEIGHTS.experience;
  }

  if (dog.special_needs) return -WEIGHTS.experience * 0.5;
  return WEIGHTS.experience * 0.5;
}

function housingScore(dog: Dog, prefs: AdopterPreferences): number {
  const isApartment =
    prefs.living_situation?.toLowerCase().includes("apartment") ?? false;

  if (!isApartment) return WEIGHTS.housing;

  if (dog.size === "large" && dog.energy_level === "high") return -WEIGHTS.housing;
  if (dog.size === "xlarge") return -WEIGHTS.housing * 0.5;
  if (dog.size === "small") return WEIGHTS.housing;
  return WEIGHTS.housing * 0.5;
}

function feeScore(dog: Dog, prefs: AdopterPreferences): number {
  if (!prefs.max_fee_cents || !dog.adoption_fee_cents) return WEIGHTS.fee * 0.5;
  return dog.adoption_fee_cents <= prefs.max_fee_cents ? WEIGHTS.fee : 0;
}

function timeListedBonus(dog: Dog): number {
  const daysListed = Math.floor(
    (Date.now() - new Date(dog.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysListed > 60) return WEIGHTS.time_listed;
  if (daysListed > 30) return WEIGHTS.time_listed * 0.6;
  return 0;
}

function generateReasons(
  dog: Dog,
  prefs: AdopterPreferences
): string[] {
  const reasons: string[] = [];

  if (prefs.activity_level?.toLowerCase().includes("active") && dog.energy_level === "high") {
    reasons.push("High-energy match for your active lifestyle");
  } else if (prefs.activity_level?.toLowerCase().includes("relax") && dog.energy_level === "low") {
    reasons.push("Perfect couch companion");
  }

  if (prefs.has_kids && dog.good_with_kids) {
    reasons.push("Great with kids");
  }

  if (prefs.has_cats && dog.good_with_cats) {
    reasons.push("Gets along with cats");
  }

  if (prefs.has_dogs && dog.good_with_dogs) {
    reasons.push("Friendly with other dogs");
  }

  if (
    prefs.living_situation?.toLowerCase().includes("apartment") &&
    (dog.size === "small" || dog.size === "medium")
  ) {
    reasons.push("Apartment-friendly size");
  }

  if (dog.house_trained) {
    reasons.push("Already house trained");
  }

  const daysListed = Math.floor(
    (Date.now() - new Date(dog.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysListed > 60) {
    reasons.push("Been waiting a while — deserves a chance");
  }

  if (reasons.length === 0) {
    reasons.push("Good overall compatibility");
  }

  return reasons.slice(0, 3);
}

export function matchDogs(
  dogs: Dog[],
  preferences: AdopterPreferences,
  limit = 8
): MatchResult[] {
  const available = dogs.filter((d) => d.status === "available");

  const scored = available.map((dog) => {
    const raw =
      energyScore(dog, preferences) +
      sizeScore(dog, preferences) +
      ageScore(dog, preferences) +
      kidsSafetyScore(dog, preferences) +
      petsSafetyScore(dog, preferences) +
      experienceScore(dog, preferences) +
      housingScore(dog, preferences) +
      feeScore(dog, preferences) +
      timeListedBonus(dog);

    const maxPossible = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    const score = Math.round(
      Math.max(0, Math.min(100, ((raw + maxPossible) / (2 * maxPossible)) * 100))
    );

    return {
      dog,
      score,
      reasons: generateReasons(dog, preferences),
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const MIN_SCORE = 30;
  return scored.filter((r) => r.score >= MIN_SCORE).slice(0, limit);
}
