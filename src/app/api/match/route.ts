import { NextRequest, NextResponse } from "next/server";
import { matchDogs } from "@/lib/matching";
import { createClient } from "@/lib/supabase/server";
import type { AdopterPreferences, Dog } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const preferences = (await request.json()) as AdopterPreferences;

    const supabase = await createClient();
    const { data: dogs, error } = await supabase
      .from("dogs")
      .select("*, shelter:shelters(*)")
      .eq("status", "available")
      .limit(200);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch dogs" },
        { status: 500 }
      );
    }

    const matches = matchDogs((dogs ?? []) as Dog[], preferences);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json(
      { error: "Failed to compute matches" },
      { status: 500 }
    );
  }
}
