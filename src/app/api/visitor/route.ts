import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

function getClientIp(requestHeaders: Headers) {
  const forwarded = requestHeaders.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  return requestHeaders.get('x-real-ip') || 'Unknown'
}

function getBrowser(userAgent: string) {
  if (/Edg\//i.test(userAgent)) return 'Edge'
  if (/OPR\//i.test(userAgent)) return 'Opera'
  if (/Chrome\//i.test(userAgent)) return 'Chrome'
  if (/Firefox\//i.test(userAgent)) return 'Firefox'
  if (/Safari\//i.test(userAgent)) return 'Safari'
  return 'Unknown'
}

function getOS(userAgent: string) {
  if (/Android/i.test(userAgent)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS'
  if (/Windows/i.test(userAgent)) return 'Windows'
  if (/Mac OS X/i.test(userAgent)) return 'macOS'
  if (/Linux/i.test(userAgent)) return 'Linux'
  return 'Unknown'
}

function formatTime(timezone?: string) {
  const date = new Date()

  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || 'UTC',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }).format(date)
  } catch {
    return date.toISOString()
  }
}

export async function POST(request: Request) {
  const webhook = process.env.DISCORD_WEBHOOK_URL
  if (!webhook) {
    return NextResponse.json({ ok: false, error: 'Webhook is not configured' }, { status: 500 })
  }

  const requestHeaders = await headers()
  const ip = getClientIp(requestHeaders)
  const userAgent = requestHeaders.get('user-agent') || 'Unknown'

  let body: { page?: string; referrer?: string } = {}
  try {
    body = await request.json()
  } catch {
    // Keep logging working even if the optional client data is missing.
  }

  let country = requestHeaders.get('x-vercel-ip-country') || 'Unknown'
  let timezone = requestHeaders.get('x-vercel-ip-timezone') || undefined
  let vpn = 'Unknown'
  let proxy = 'Unknown'
  let tor = 'Unknown'
  let hosting = 'Unknown'
  let network = 'Unknown'

  const ipinfoToken = process.env.IPINFO_TOKEN

  if (ipinfoToken && ip !== 'Unknown') {
    try {
      const response = await fetch(
        `https://ipinfo.io/${encodeURIComponent(ip)}?token=${encodeURIComponent(ipinfoToken)}`,
        { cache: 'no-store' }
      )

      if (response.ok) {
        const data = await response.json()
        country = data.country || data.geo?.country || country
        timezone = data.timezone || data.geo?.timezone || timezone
        network = data.org || data.as?.name || 'Unknown'

        if (data.anonymous) {
          vpn = data.anonymous.is_vpn ? 'Yes' : 'No'
          proxy = data.anonymous.is_proxy ? 'Yes' : 'No'
          tor = data.anonymous.is_tor ? 'Yes' : 'No'
        }

        if (typeof data.is_hosting === 'boolean') {
          hosting = data.is_hosting ? 'Yes' : 'No'
        } else if (data.anonymous && typeof data.anonymous.is_hosting === 'boolean') {
          hosting = data.anonymous.is_hosting ? 'Yes' : 'No'
        }
      }
    } catch {
      // Do not block the Discord notification if IP intelligence is unavailable.
    }
  }

  const embed = {
    title: 'New Portfolio Visit',
    color: 0xb284ff,
    fields: [
      { name: 'IP', value: `\`${ip}\``, inline: true },
      { name: 'Page', value: `\`${body.page || '/'}\``, inline: true },
      { name: 'Browser', value: getBrowser(userAgent), inline: true },
      { name: 'OS', value: getOS(userAgent), inline: true },
      { name: 'Country', value: country, inline: true },
      { name: 'Time', value: formatTime(timezone), inline: true },
      { name: 'Referrer', value: body.referrer || 'Direct', inline: false },
      { name: 'VPN', value: vpn, inline: true },
      { name: 'Proxy', value: proxy, inline: true },
      { name: 'Tor', value: tor, inline: true },
      { name: 'Hosting', value: hosting, inline: true },
      { name: 'Network', value: network, inline: true },
    ],
    footer: { text: 'kiel.dev visitor logging' },
    timestamp: new Date().toISOString(),
  }

  const discordResponse = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  })

  if (!discordResponse.ok) {
    return NextResponse.json({ ok: false, error: 'Discord webhook failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
