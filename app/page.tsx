"use client"

import { useState } from "react"
import { Heart, Sparkles, RefreshCw, Moon, Sun, Quote, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

interface CompatibilityResult {
  percentage: string
  result: string
}

interface NameMeaning {
  name: string
  meaning: string
}

interface LoveQuote {
  quote: string
  author: string
}

export default function HeartMatch() {
  const [yourName, setYourName] = useState("")
  const [partnerName, setPartnerName] = useState("")
  const [yourBirthday, setYourBirthday] = useState("")
  const [partnerBirthday, setPartnerBirthday] = useState("")
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<LoveQuote | null>(null)
  const [nameMeanings, setNameMeanings] = useState<NameMeaning[]>([])
  const [shipName, setShipName] = useState("")
  const [horoscope, setHoroscope] = useState("")
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const loveQuotes: LoveQuote[] = [
    {
      quote: "Love is not just looking at each other, it's looking in the same direction.",
      author: "Antoine de Saint-Exupéry",
    },
    { quote: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
    { quote: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
    {
      quote: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.",
      author: "Dr. Seuss",
    },
    { quote: "Love is friendship that has caught fire.", author: "Ann Land" },
    { quote: "The greatest happiness of life is the conviction that we are loved.", author: "Victor Hugo" },
    {
      quote: "Love is when the other person's happiness is more important than your own.",
      author: "H. Jackson Brown Jr.",
    },
    { quote: "True love stories never have endings.", author: "Richard Bach" },
  ]

  const nameTraits: Record<string, string[]> = {
    a: ["Adventurous", "Ambitious", "Artistic"],
    b: ["Bold", "Beautiful", "Brave"],
    c: ["Caring", "Creative", "Charming"],
    d: ["Determined", "Dreamy", "Devoted"],
    e: ["Energetic", "Empathetic", "Elegant"],
    f: ["Faithful", "Fun-loving", "Fearless"],
    g: ["Gentle", "Generous", "Graceful"],
    h: ["Honest", "Hopeful", "Harmonious"],
    i: ["Inspiring", "Intuitive", "Independent"],
    j: ["Joyful", "Just", "Jovial"],
    k: ["Kind", "Knowledgeable", "Keen"],
    l: ["Loving", "Loyal", "Lively"],
    m: ["Mysterious", "Magnetic", "Mindful"],
    n: ["Nurturing", "Noble", "Natural"],
    o: ["Optimistic", "Original", "Open-hearted"],
    p: ["Passionate", "Peaceful", "Playful"],
    q: ["Quiet", "Quick-witted", "Quality-focused"],
    r: ["Romantic", "Reliable", "Radiant"],
    s: ["Sweet", "Strong", "Sincere"],
    t: ["Thoughtful", "Trustworthy", "Tender"],
    u: ["Understanding", "Unique", "Uplifting"],
    v: ["Vibrant", "Virtuous", "Vivacious"],
    w: ["Wise", "Warm", "Wonderful"],
    x: ["eXtraordinary", "eXciting", "eXpressive"],
    y: ["Youthful", "Yearning", "Yes-saying"],
    z: ["Zealous", "Zestful", "Zen-like"],
  }

  const generateShipName = (name1: string, name2: string) => {
    if (!name1 || !name2) return ""
    const mid1 = Math.ceil(name1.length / 2)
    const mid2 = Math.floor(name2.length / 2)
    return name1.slice(0, mid1) + name2.slice(mid2)
  }

  const getNameMeaning = (name: string): string => {
    if (!name) return ""
    const firstLetter = name.toLowerCase()[0]
    const traits = nameTraits[firstLetter] || ["Special", "Unique", "Amazing"]
    const randomTrait = traits[Math.floor(Math.random() * traits.length)]
    return `${randomTrait} and full of love`
  }

  const generateHoroscope = (date1: string, date2: string, percentage: number) => {
    if (!date1 || !date2) return ""

    const horoscopes = [
      `The stars align perfectly for your love! Your cosmic energy creates a ${percentage}% harmony.`,
      `Venus smiles upon your union. The celestial bodies predict a ${percentage}% compatibility filled with joy.`,
      `Your love story is written in the stars with ${percentage}% cosmic compatibility.`,
      `The universe conspires to bring you together with ${percentage}% stellar alignment.`,
      `Destiny has woven your paths together with ${percentage}% celestial blessing.`,
    ]

    return horoscopes[Math.floor(Math.random() * horoscopes.length)]
  }

  const getRandomQuote = () => {
    const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)]
    setCurrentQuote(randomQuote)
  }

  const animatePercentage = (targetPercentage: number) => {
    setAnimatedPercentage(0)
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = targetPercentage / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetPercentage) {
        setAnimatedPercentage(targetPercentage)
        clearInterval(timer)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else {
        setAnimatedPercentage(Math.floor(current))
      }
    }, duration / steps)
  }

  const checkCompatibility = async () => {
    if (!yourName.trim() || !partnerName.trim()) {
      setError("Please enter both names!")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `/api/compatibility?fname=${encodeURIComponent(yourName)}&sname=${encodeURIComponent(partnerName)}`,
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to check compatibility")
      }

      const data = await response.json()
      setResult(data)

      // Generate additional features
      const ship = generateShipName(yourName, partnerName)
      setShipName(ship)

      const meanings = [
        { name: yourName, meaning: getNameMeaning(yourName) },
        { name: partnerName, meaning: getNameMeaning(partnerName) },
      ]
      setNameMeanings(meanings)

      if (yourBirthday && partnerBirthday) {
        const horoscopeText = generateHoroscope(yourBirthday, partnerBirthday, Number.parseInt(data.percentage))
        setHoroscope(horoscopeText)
      }

      getRandomQuote()
      animatePercentage(Number.parseInt(data.percentage))
    } catch (err) {
      console.error("Error:", err)
      setError("Something went wrong. Please try again!")
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setYourName("")
    setPartnerName("")
    setYourBirthday("")
    setPartnerBirthday("")
    setResult(null)
    setError("")
    setCurrentQuote(null)
    setNameMeanings([])
    setShipName("")
    setHoroscope("")
    setAnimatedPercentage(0)
    setShowConfetti(false)
  }

  const getCompatibilityMessage = (percentage: number) => {
    if (percentage >= 90) return "You're absolutely perfect together! 💕✨"
    if (percentage >= 80) return "You're soulmates! 💘"
    if (percentage >= 70) return "Great match! Love is in the air! 💖"
    if (percentage >= 60) return "Good compatibility! Keep nurturing your love! 💗"
    if (percentage >= 50) return "There's potential! Work on it together! 💝"
    return "Opposites attract! Every love story is unique! 💌"
  }

  const getHeartEmojis = (percentage: number) => {
    if (percentage >= 90) return "💕✨💖✨💕"
    if (percentage >= 80) return "💘💖💘"
    if (percentage >= 70) return "💖💗💖"
    if (percentage >= 60) return "💗💝💗"
    if (percentage >= 50) return "💝💌💝"
    return "💌💕💌"
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-purple-900 via-pink-900 to-red-900"
          : "bg-gradient-to-br from-pink-100 via-red-50 to-rose-100"
      } flex items-center justify-center p-4 font-['Poppins',sans-serif] relative overflow-hidden`}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            >
              {["💖", "💕", "💘", "✨", "🎉"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-md">
        <Card
          className={`${
            darkMode ? "bg-gray-900/90 border-pink-500/20" : "bg-white/90"
          } backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden transition-all duration-500`}
        >
          <CardContent className="p-8">
            {/* Theme Toggle */}
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2">
                <Sun className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-yellow-500"}`} />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-pink-500" />
                <Moon className={`w-4 h-4 ${darkMode ? "text-pink-400" : "text-gray-400"}`} />
              </div>
            </div>

            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-8 h-8 text-red-500 animate-pulse" fill="currentColor" />
                <h1
                  className={`text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent`}
                >
                  Heart Match
                </h1>
                <Heart className="w-8 h-8 text-red-500 animate-pulse" fill="currentColor" />
              </div>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                Discover your love compatibility!
              </p>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>
                  Your Name
                </label>
                <Input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="Enter your name..."
                  className={`rounded-2xl ${
                    darkMode
                      ? "border-pink-500/30 focus:border-pink-400 focus:ring-pink-300 bg-gray-800/50 text-white"
                      : "border-pink-200 focus:border-red-300 focus:ring-red-200 bg-pink-50/50"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>
                  Partner's Name
                </label>
                <Input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Enter partner's name..."
                  className={`rounded-2xl ${
                    darkMode
                      ? "border-pink-500/30 focus:border-pink-400 focus:ring-pink-300 bg-gray-800/50 text-white"
                      : "border-pink-200 focus:border-red-300 focus:ring-red-200 bg-pink-50/50"
                  }`}
                />
              </div>

              {/* Optional Birthday Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                    Your Birthday (Optional)
                  </label>
                  <Input
                    type="date"
                    value={yourBirthday}
                    onChange={(e) => setYourBirthday(e.target.value)}
                    className={`rounded-xl text-xs ${
                      darkMode
                        ? "border-pink-500/30 focus:border-pink-400 bg-gray-800/50 text-white"
                        : "border-pink-200 focus:border-red-300 bg-pink-50/50"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                    Partner's Birthday (Optional)
                  </label>
                  <Input
                    type="date"
                    value={partnerBirthday}
                    onChange={(e) => setPartnerBirthday(e.target.value)}
                    className={`rounded-xl text-xs ${
                      darkMode
                        ? "border-pink-500/30 focus:border-pink-400 bg-gray-800/50 text-white"
                        : "border-pink-200 focus:border-red-300 bg-pink-50/50"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm text-center mb-4 bg-red-50 p-3 rounded-2xl">{error}</div>}

            {/* Check Compatibility Button */}
            <Button
              onClick={checkCompatibility}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 mb-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Checking...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Check Compatibility ❤️
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
            </Button>

            {/* Result Area */}
            {result && (
              <div className="text-center space-y-4 animate-in fade-in duration-500">
                {/* Animated Progress Bar */}
                <div
                  className={`${
                    darkMode
                      ? "bg-gradient-to-r from-pink-900/50 to-red-900/50 border-pink-500/20"
                      : "bg-gradient-to-r from-pink-50 to-red-50 border-pink-200"
                  } p-6 rounded-2xl border`}
                >
                  <div className="text-4xl font-bold text-red-500 mb-4">{animatedPercentage}% Compatible</div>
                  <Progress value={animatedPercentage} className="w-full h-3 mb-4" />
                  <div className="text-2xl mb-3">{getHeartEmojis(Number.parseInt(result.percentage))}</div>
                  <p className={`${darkMode ? "text-gray-200" : "text-gray-700"} font-medium`}>
                    {getCompatibilityMessage(Number.parseInt(result.percentage))}
                  </p>
                </div>

                {/* Ship Name */}
                {shipName && (
                  <div
                    className={`${
                      darkMode ? "bg-purple-900/50 border-purple-500/20" : "bg-purple-50 border-purple-200"
                    } p-4 rounded-2xl border`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      <span className={`${darkMode ? "text-gray-200" : "text-gray-700"} font-medium`}>
                        Your Ship Name
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{shipName}</div>
                  </div>
                )}

                {/* Name Meanings */}
                {nameMeanings.length > 0 && (
                  <div className="space-y-2">
                    {nameMeanings.map((meaning, index) => (
                      <div
                        key={index}
                        className={`${
                          darkMode ? "bg-blue-900/50 border-blue-500/20" : "bg-blue-50 border-blue-200"
                        } p-3 rounded-xl border text-sm`}
                      >
                        <span className="font-semibold text-blue-600">{meaning.name}:</span>
                        <span className={`${darkMode ? "text-gray-200" : "text-gray-700"} ml-2`}>
                          {meaning.meaning}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Horoscope */}
                {horoscope && (
                  <div
                    className={`${
                      darkMode ? "bg-yellow-900/50 border-yellow-500/20" : "bg-yellow-50 border-yellow-200"
                    } p-4 rounded-2xl border`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className={`${darkMode ? "text-gray-200" : "text-gray-700"} font-medium`}>
                        Love Horoscope
                      </span>
                    </div>
                    <p className={`${darkMode ? "text-gray-200" : "text-gray-700"} text-sm`}>{horoscope}</p>
                  </div>
                )}

                {/* Love Quote */}
                {currentQuote && (
                  <div
                    className={`${
                      darkMode ? "bg-green-900/50 border-green-500/20" : "bg-green-50 border-green-200"
                    } p-4 rounded-2xl border`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Quote className="w-5 h-5 text-green-500" />
                      <span className={`${darkMode ? "text-gray-200" : "text-gray-700"} font-medium`}>Love Quote</span>
                    </div>
                    <p className={`${darkMode ? "text-gray-200" : "text-gray-700"} text-sm italic mb-2`}>
                      "{currentQuote.quote}"
                    </p>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-xs`}>- {currentQuote.author}</p>
                    <Button
                      onClick={getRandomQuote}
                      variant="outline"
                      size="sm"
                      className={`mt-2 ${
                        darkMode
                          ? "border-green-500/30 text-green-400 hover:bg-green-900/30"
                          : "border-green-300 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      Get Another Quote
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Reset Button */}
            {(result || yourName || partnerName) && (
              <Button
                onClick={reset}
                variant="outline"
                className={`w-full mt-4 ${
                  darkMode
                    ? "border-pink-500/30 text-pink-400 hover:bg-pink-900/30"
                    : "border-pink-300 text-pink-600 hover:bg-pink-50"
                } rounded-2xl py-3 bg-transparent`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}

            {/* Footer */}
            <div className={`text-center mt-8 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <div className="mb-1">Made with 💖 for love birds everywhere</div>
              <div className="flex items-center justify-center gap-1">
                <span>Created by</span>
                <a
                  href="https://t.me/Ashuxxd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-semibold hover:text-pink-500 transition-colors duration-200 ${
                    darkMode ? "text-pink-400" : "text-pink-600"
                  }`}
                >
                  Ashu
                </a>
                <span className="text-blue-500">📱</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
