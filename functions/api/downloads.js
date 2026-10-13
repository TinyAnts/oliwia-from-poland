// Download counter for the free Thirukkural PDF.
//
// Runs as a Cloudflare Pages Function at /api/downloads.
//   GET  /api/downloads  -> {"count": 123}         (read the total)
//   POST /api/downloads  -> {"count": 124}         (add one download)
//
// Storage: a free Cloudflare D1 database bound to this Pages project under the
// variable name DOWNLOADS_DB (Settings -> Bindings -> D1 database). The table is
// created automatically on first use, so nothing has to be typed into a console.
// Counts are kept per day, so the dashboard can show how demand changes over time.
//
// If the binding is missing, both routes answer 503 and the website simply hides
// the counter. The PDF itself is a plain static file and always downloads.

const ITEM = "thirukkural-10";

const SCHEMA = `CREATE TABLE IF NOT EXISTS downloads (
  item TEXT NOT NULL,
  day  TEXT NOT NULL,
  n    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (item, day)
)`;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}

async function total(db) {
  const row = await db
    .prepare("SELECT COALESCE(SUM(n), 0) AS total FROM downloads WHERE item = ?1")
    .bind(ITEM)
    .first();
  return Number(row?.total ?? 0);
}

async function ready(env) {
  const db = env.DOWNLOADS_DB;
  if (!db) return null;
  await db.prepare(SCHEMA).run();
  return db;
}

export async function onRequestGet({ env }) {
  try {
    const db = await ready(env);
    if (!db) return json({ count: null, error: "counter not set up" }, 503);
    return json({ count: await total(db) });
  } catch (err) {
    return json({ count: null, error: "counter unavailable" }, 503);
  }
}

export async function onRequestPost({ request, env }) {
  // Only count clicks that come from this website, not from other sites.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ error: "forbidden" }, 403);
  }

  try {
    const db = await ready(env);
    if (!db) return json({ count: null, error: "counter not set up" }, 503);

    // Light protection against one person clicking many times in a row:
    // the same visitor is counted at most once every 30 seconds.
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const cache = typeof caches !== "undefined" ? caches.default : null;
    const throttleKey = new Request(`https://counter.invalid/${ITEM}/${encodeURIComponent(ip)}`);
    if (cache && (await cache.match(throttleKey))) {
      return json({ count: await total(db), counted: false });
    }

    const day = new Date().toISOString().slice(0, 10);
    await db
      .prepare(
        "INSERT INTO downloads (item, day, n) VALUES (?1, ?2, 1) " +
          "ON CONFLICT (item, day) DO UPDATE SET n = n + 1"
      )
      .bind(ITEM, day)
      .run();

    if (cache) {
      await cache.put(
        throttleKey,
        new Response("1", { headers: { "cache-control": "max-age=30" } })
      );
    }

    return json({ count: await total(db), counted: true });
  } catch (err) {
    return json({ count: null, error: "counter unavailable" }, 503);
  }
}

export function onRequest() {
  return new Response("Method not allowed", {
    status: 405,
    headers: { allow: "GET, POST" },
  });
}
