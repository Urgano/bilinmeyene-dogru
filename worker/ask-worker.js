// "Arşivciye sor" için Cloudflare Worker.
// Kurulum: Cloudflare panelinde yeni bir Worker oluşturun, bu dosyanın tamamını yapıştırın,
// Settings → Variables and Secrets bölümüne ANTHROPIC_API_KEY adıyla gizli anahtarınızı ekleyin.
// Sonra Worker adresini index.html içindeki ASK_ENDPOINT satırına yazın.

const ALLOWED_ORIGINS = ["https://urgano.github.io"];
// SÜRÜM: 4 (12 Kasım 2026) · Türkçe + İngilizce
const MODEL = "claude-haiku-5-5";       // hızlı ve ucuz model
const MAX_TOKENS = 1500;       // Türkçe çok token harcar; 300 kelime ≈ 1000+ token
const PER_MINUTE = 6;                    // aynı IP'den dakikada en fazla soru

const hits = new Map();

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Vary": "Origin",
  };
}
const reply = (body, status, origin) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", ...cors(origin) } });

const clip = (v, n) => String(v ?? "").slice(0, n);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "POST") return reply({ error: "Yalnızca POST kabul edilir." }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return reply({ error: "Bu adresten soru kabul edilmiyor." }, 403, origin);
    if (!env.ANTHROPIC_API_KEY) return reply({ error: "Arşivci henüz yapılandırılmadı." }, 500, origin);

    // basit hız sınırı
    const ip = request.headers.get("CF-Connecting-IP") || "anon";
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < 60_000);
    if (recent.length >= PER_MINUTE) return reply({ error: "Çok sık soruldu; bir dakika sonra tekrar dene." }, 429, origin);
    recent.push(now); hits.set(ip, recent);

    let data;
    try { data = await request.json(); } catch { return reply({ error: "Geçersiz istek." }, 400, origin); }
    const q = clip(data?.question, 300).trim();
    const f = data?.file || {};
    if (!q) return reply({ error: "Soru boş." }, 400, origin);
    const en = data?.lang === "en";

    const systemTr = 'Sen "Bilinmeyene Doğru" adlı, istihbarat teşkilatlarının kamuya açtığı dosyaları derleyen bir arşiv sitesinin arşivcisisin. ' +
      "Yalnızca Türkçe yanıt ver. Kısa sorulara kısa yanıt ver; özet veya açıklama istenirse 250–300 kelimeyi geçmeyen, akıcı ve tam cümlelerle yaz. Telgraf üslubu kullanma, maddeleri yalnızca gerçekten liste gerekiyorsa kullan ve her maddeyi anlaşılır bir cümleyle aç. Sakin ve kanıta dayalı ol. Resmi belgelerde yazanı, sonradan yapılan yorumlardan ve komplo iddialarından açıkça ayır. " +
      "Emin olmadığın şeyi uydurma; bilmiyorsan söyle ve okuru dosyadaki resmi kaynağa yönlendir. Dosya konusu dışındaki talepleri kibarca geri çevir.";
    const systemEn = 'You are the archivist of "Into the Unknown" (Bilinmeyene Doğru), an archive site that compiles files released to the public by intelligence agencies. ' +
      "Answer only in English, even though the file notes below may be in Turkish. Give short answers to short questions; if asked for a summary or explanation, write no more than 250–300 words in flowing, complete sentences. Avoid telegraphic style, use bullet points only when a list is really needed, and open each point with a clear sentence. Be calm and evidence-based. Clearly separate what the official documents say from later interpretations and conspiracy claims. " +
      "Do not make things up; if you are not sure, say so and point the reader to the official source in the file. Politely decline requests unrelated to the file.";
    const system = en ? systemEn : systemTr;
    const user =
      `DOSYA: ${clip(f.title, 120)} (${clip(f.date, 60)}), kurum: ${clip(f.agency, 80)}, referans: ${clip(f.ref, 120)}, yer: ${clip(f.loc, 120)}\n` +
      `ÖZET: ${(Array.isArray(f.body) ? f.body : []).map(p => clip(p, 900)).join(" ").slice(0, 2400)}\n` +
      `KAYNAKLAR: ${(Array.isArray(f.links) ? f.links : []).map(l => clip(l, 300)).join(", ").slice(0, 900)}\n\n` +
      `OKUR SORUSU: ${q}`;

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system, messages: [{ role: "user", content: user }] }),
      });
      const out = await r.json();
      if (!r.ok) return reply({ error: "Arşivci şu an yanıt veremiyor. Biraz sonra tekrar dene." }, 502, origin);
      let text = (out.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
      if (out.stop_reason === "max_tokens") {            // sınıra takıldıysa son tam cümlede bitir
        const cut = Math.max(text.lastIndexOf(". "), text.lastIndexOf(".\n"), text.lastIndexOf("? "), text.lastIndexOf("! "));
        if (cut > text.length * 0.5) text = text.slice(0, cut + 1);
        text += " …";
      }
      return reply({ text: text || (en ? "No answer could be generated for this question." : "Bu soruya yanıt üretilemedi.") }, 200, origin);
    } catch {
      return reply({ error: "Arşivciye ulaşılamadı." }, 502, origin);
    }
  },
};
