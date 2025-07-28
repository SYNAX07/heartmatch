import { type NextRequest, NextResponse } from "next/server"

// Fallback compatibility calculator
function calculateCompatibility(name1: string, name2: string): { percentage: string; result: string } {
  // Simple algorithm based on name compatibility
  const combined = (name1 + name2).toLowerCase()
  let score = 0

  // Calculate based on common letters
  const name1Letters = name1.toLowerCase().split("")
  const name2Letters = name2.toLowerCase().split("")

  for (const letter of name1Letters) {
    if (name2Letters.includes(letter)) {
      score += 10
    }
  }

  // Add some randomness based on name lengths
  const lengthFactor = Math.abs(name1.length - name2.length)
  score += (10 - lengthFactor) * 5

  // Normalize to percentage
  let percentage = Math.min(Math.max(score % 100, 25), 99)

  // Add some deterministic randomness based on names
  const nameSum = combined.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  percentage = Math.max(25, (percentage + (nameSum % 30)) % 100)

  return {
    percentage: percentage.toString(),
    result: `${name1} and ${name2} are ${percentage}% compatible!`,
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const fname = searchParams.get("fname")
  const sname = searchParams.get("sname")

  if (!fname || !sname) {
    return NextResponse.json({ error: "Both names are required" }, { status: 400 })
  }

  try {
    // Try the external API first
    const response = await fetch(
      `https://love-calculator.p.rapidapi.com/getPercentage?sname=${encodeURIComponent(sname)}&fname=${encodeURIComponent(fname)}`,
      {
        headers: {
          "x-rapidapi-host": "love-calculator.p.rapidapi.com",
          "x-rapidapi-key": "7ecf3fc05fmsh6d2eb6e571d2883p1d1290jsn851b0c2889c3",
        },
        // Add timeout
        signal: AbortSignal.timeout(5000),
      },
    )

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      throw new Error("External API failed")
    }
  } catch (error) {
    // Fallback to our own calculation
    console.log("Using fallback compatibility calculation")
    const fallbackResult = calculateCompatibility(fname, sname)
    return NextResponse.json(fallbackResult)
  }
}
