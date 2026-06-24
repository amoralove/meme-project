import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = searchParams.get("size");
  const energy = searchParams.get("energy");
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const supabase = await createClient();
  let query = supabase
    .from("dogs")
    .select("*, shelter:shelters(id, name, city, state)", { count: "exact" })
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (size) query = query.eq("size", size);
  if (energy) query = query.eq("energy_level", energy);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch dogs" },
      { status: 500 }
    );
  }

  return NextResponse.json({ dogs: data, total: count });
}
