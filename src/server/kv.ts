/**
 * Tiny KV used for rate limiting and idempotency.
 * - Production (serverless / multiple instances): set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 * - Otherwise: in-memory fallback (fine for a single long-running Node process & local dev).
 */
interface Kv {
  incr(key: string, ttlSec: number): Promise<number>;
  setNx(key: string, value: string, ttlSec: number): Promise<boolean>;
  set(key: string, value: string, ttlSec: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
}

const mem = new Map<string, { v: string; exp: number }>();
function memGet(k: string) {
  const e = mem.get(k);
  if (!e) return null;
  if (e.exp < Date.now()) {
    mem.delete(k);
    return null;
  }
  return e.v;
}
function sweep() {
  if (mem.size < 5000) return;
  const now = Date.now();
  for (const [k, e] of mem) if (e.exp < now) mem.delete(k);
}

const memoryKv: Kv = {
  async incr(k, ttl) {
    sweep();
    const cur = Number(memGet(k) ?? 0) + 1;
    const exp = mem.get(k)?.exp ?? Date.now() + ttl * 1000;
    mem.set(k, { v: String(cur), exp });
    return cur;
  },
  async setNx(k, v, ttl) {
    if (memGet(k) !== null) return false;
    mem.set(k, { v, exp: Date.now() + ttl * 1000 });
    return true;
  },
  async set(k, v, ttl) {
    mem.set(k, { v, exp: Date.now() + ttl * 1000 });
  },
  async get(k) {
    return memGet(k);
  },
  async del(k) {
    mem.delete(k);
  },
};

function upstashKv(url: string, token: string): Kv {
  const call = async (cmds: (string | number)[][]) => {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmds),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);
    return (await res.json()) as { result: unknown }[];
  };
  return {
    async incr(k, ttl) {
      const r = await call([["INCR", k], ["EXPIRE", k, ttl, "NX"]]);
      return Number(r[0].result);
    },
    async setNx(k, v, ttl) {
      const r = await call([["SET", k, v, "NX", "EX", ttl]]);
      return r[0].result === "OK";
    },
    async set(k, v, ttl) {
      await call([["SET", k, v, "EX", ttl]]);
    },
    async get(k) {
      const r = await call([["GET", k]]);
      return (r[0].result as string | null) ?? null;
    },
    async del(k) {
      await call([["DEL", k]]);
    },
  };
}

export const kv: Kv =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? upstashKv(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN)
    : memoryKv;
