// Deterministic hook scoring. No AI here: same hook, same score, every time.
const CLICHES = [
  "i'm excited to share", "i am excited to share", "here's why", "let me tell you",
  "in today's world", "in today's fast-paced", "i'm thrilled to announce",
  "i am thrilled to announce", "excited to announce", "here's the thing", "let that sink in",
];
const norm = (s) => String(s).toLowerCase().replace(/[\u2018\u2019]/g, "'").trim();

export const RULES = [
  {
    id: "length",
    fail: "Too long. Keep the hook to 2 short lines and 210 characters or less.",
    pass: (h) => h.length <= 210 && h.split(/\r?\n/).filter((l) => l.trim()).length <= 2,
  },
  {
    id: "number",
    fail: "No number or concrete detail. Add a figure, a date or a real result.",
    pass: (h) => /\d/.test(h),
  },
  {
    id: "cliche",
    fail: "Starts with an overused opener. Open with the point itself.",
    pass: (h) => !CLICHES.some((c) => norm(h).startsWith(c)),
  },
  {
    id: "reader",
    fail: "Does not speak to the reader. Use \"you\" or ask a question.",
    pass: (h) => /\b(you|your|you're|yours)\b/.test(norm(h)) || h.includes("?"),
  },
  {
    id: "opener",
    fail: "Starts with I or We. Lead with the reader's problem or a result.",
    pass: (h) => !/^(i|we|our)\b/.test(norm(h)),
  },
];

export function scoreHook(raw) {
  const hook = String(raw || "").trim();
  const failed = [];
  let score = 0;
  for (const r of RULES) {
    if (r.pass(hook)) score += 20;
    else failed.push({ id: r.id, message: r.fail });
  }
  return { score, failed };
}
