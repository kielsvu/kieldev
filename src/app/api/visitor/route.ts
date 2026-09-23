import { NextRequest, NextResponse } from "next/server"

type IpInfo = {
  country?: string
  org?: string
  privacy?: {
    vpn?: boolean
    proxy?: boolean
    tor?: boolean
    relay?: boolean
    hosting?: boolean
  }
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "Unknown"
  )
}

function getBrowser(userAgent: string) {
  if (/Edg\//i.test(userAgent)) return "Edge"
  if (/OPR\//i.test(userAgent)) return "Opera"
  if (/Chrome\//i.test(userAgent)) return "Chrome"
  if (/Firefox\//i.test(userAgent)) return "Firefox"
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) return "Safari"
  return "Unknown"
}

function getOS(userAgent: string) {
  if (/Android/i.test(userAgent)) return "Android"
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS"
  if (/Windows/i.test(userAgent)) return "Windows"
  if (/Mac OS X/i.test(userAgent)) return "macOS"
  if (/Linux/i.test(userAgent)) return "Linux"
  return "Unknown"
}

function formatReferrer(referrer: string) {
  if (!referrer) return "Direct"

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "")
    if (host.includes("google.")) return "Google"
    if (host.includes("bing.")) return "Bing"
    if (host.includes("yahoo.")) return "Yahoo"
    if (host.includes("github.")) return "GitHub"
    return host
  } catch {
    return "Unknown"
  }
}

function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Manila",
    timeZoneName: "short",
  }).format(date)
}

export async function POST(request: NextRequest) {
  const webhook = process.env.DISCORD_WEBHOOK_URL

  if (!webhook) {
    console.error("Visitor logging: DISCORD_WEBHOOK_URL is missing")
    return NextResponse.json(
      { ok: false, error: "DISCORD_WEBHOOK_URL is not configured" },
      { status: 500 },
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const ip = getClientIp(request)
    const userAgent = request.headers.get("user-agent") || ""

    let country = request.headers.get("x-vercel-ip-country") || "Unknown"
    let network = "Unknown"
    let vpn = "Unknown"
    let proxy = "Unknown"
    let tor = "Unknown"
    let hosting = "Unknown"

    const token = process.env.IPINFO_TOKEN

    if (ip !== "Unknown") {
      const url = token
        ? `https://ipinfo.io/${encodeURIComponent(ip)}/json?token=${encodeURIComponent(token)}`
        : `https://ipinfo.io/${encodeURIComponent(ip)}/json`

      try {
        const response = await fetch(url, {
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        })

        if (response.ok) {
          const info = (await response.json()) as IpInfo
          country = info.country || country
          network = info.org || "Unknown"

          if (info.privacy) {
            vpn = info.privacy.vpn === true ? "Yes" : "No"
            proxy = info.privacy.proxy === true ? "Yes" : "No"
            tor = info.privacy.tor === true ? "Yes" : "No"
            hosting = info.privacy.hosting === true ? "Yes" : "No"
          }
        } else {
          console.warn("IPinfo request failed:", response.status)
        }
      } catch (error) {
        console.warn("IPinfo request failed:", error)
      }
    }

    const page = typeof body.page === "string" ? body.page.slice(0, 500) : "/"
    const referrer =
      typeof body.referrer === "string"
        ? formatReferrer(body.referrer)
        : "Direct"

    const content = [
      "## New Portfolio Visit",
      "",
      `**IP:** \`${ip}\``,
      `**Page:** \`${page}\``,
      `**Browser:** ${getBrowser(userAgent)}`,
      `**OS:** ${getOS(userAgent)}`,
      `**Country:** ${country}`,
      `**Time:** ${formatTime()}`,
      `**Referrer:** ${referrer}`,
      "",
      `**VPN:** ${vpn}`,
      `**Proxy:** ${proxy}`,
      `**Tor:** ${tor}`,
      `**Hosting:** ${hosting}`,
      `**Network:** ${network}`,
    ].join("\n")

    const discordResponse = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Portfolio Visitor",
        content,
        allowed_mentions: { parse: [] },
      }),
      cache: "no-store",
    })

    if (!discordResponse.ok) {
      const discordError = await discordResponse.text().catch(() => "")
      console.error(
        "Discord webhook failed:",
        discordResponse.status,
        discordError,
      )

      return NextResponse.json(
        {
          ok: false,
          error: `Discord webhook failed (${discordResponse.status})`,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Visitor logging failed:", error)
    return NextResponse.json(
      { ok: false, error: "Visitor logging failed" },
      { status: 500 },
    )
  }
}
