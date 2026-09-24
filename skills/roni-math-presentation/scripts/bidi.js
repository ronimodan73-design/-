/**
 * bidi.js — RTL/LTR fix for mixed Hebrew + Latin/math strings going into
 * pptxgenjs addText().
 *
 * Canonical source: hebrew-math-notation/scripts/bidi_wrap.js.
 * This file PREFERS that copy when it can be resolved, and falls back to a
 * mirror of the same algorithm so this skill also works standalone.
 * If you change the algorithm, change it in hebrew-math-notation first.
 */

const path = require("path");
const fs = require("fs");

function tryCanonical() {
  const rel = path.join("hebrew-math-notation", "scripts", "bidi_wrap.js");
  const roots = [
    path.join(__dirname, "..", ".."),                       // sibling skill dir
    path.join(__dirname, "..", "..", "synced"),
    path.join(process.env.HOME || "", ".claude", "skills"),
    path.join(process.env.HOME || "", ".claude", "skills", "synced"),
  ];
  for (const r of roots) {
    const p = path.join(r, rel);
    try { if (fs.existsSync(p)) return require(p); } catch (_) {}
  }
  return null;
}

const HEB = /[֐-׿]/;
const LAT = /[A-Za-z0-9]/;
const LRE = "‪";
const PDF = "‬";

function classify(str) {
  const chars = [...String(str)];
  const cls = chars.map((c) => (HEB.test(c) ? "r" : LAT.test(c) ? "l" : "n"));

  const OPEN = { "(": ")", "[": "]" };
  const CLOSE = { ")": "(", "]": "[" };
  const stack = [];
  for (let i = 0; i < chars.length; i++) {
    if (OPEN[chars[i]]) stack.push(i);
    else if (CLOSE[chars[i]] && stack.length) {
      const open = stack.pop();
      let hasR = false, hasL = false;
      for (let k = open + 1; k < i; k++) {
        if (cls[k] === "r") hasR = true;
        else if (cls[k] === "l") hasL = true;
      }
      if (hasL && !hasR) { cls[open] = "l"; cls[i] = "l"; }
      else if (hasR && !hasL) { cls[open] = "r"; cls[i] = "r"; }
    }
  }

  let last = "r";
  for (let i = 0; i < cls.length; i++) {
    if (cls[i] === "n") {
      let nxt = "r";
      for (let j = i + 1; j < cls.length; j++) {
        if (cls[j] !== "n") { nxt = cls[j]; break; }
      }
      cls[i] = last === nxt ? last : "r";
    } else last = cls[i];
  }
  return { chars, cls };
}

function pmxLocal(str) {
  const { chars, cls } = classify(str);
  let out = "", buf = "", cur = cls[0] || "r";
  const flush = () => { if (buf) { out += cur === "l" ? LRE + buf + PDF : buf; buf = ""; } };
  chars.forEach((c, i) => { if (cls[i] !== cur) { flush(); cur = cls[i]; } buf += c; });
  flush();
  return out;
}

const canonical = tryCanonical();
const pmx = canonical && typeof canonical.pmx === "function" ? canonical.pmx : pmxLocal;

/** ltr(expr) — a pure-math string that must never be reordered by the UBA. */
function ltr(str) { return LRE + String(str) + PDF; }

module.exports = { pmx, ltr, classify, usingCanonical: !!canonical, LRE, PDF };
