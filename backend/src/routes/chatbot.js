import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const faqPath = path.join(__dirname, "..", "chatbot", "faq.th.json");
const FAQ = JSON.parse(fs.readFileSync(faqPath, "utf8"));

// กฎ intent ง่าย ๆ (ไทย/อังกฤษ)
const RULES = [
  { intent: "donate_intro", re: /(โดเนท|บริจาค|ชำระ|จ่าย|payment|donate)/i },
  { intent: "donate_min", re: /(ขั้นต่ำ|min)/i },
  {
    intent: "donate_methods",
    re: /(จ่ายด้วย|วิธีชำระ|method|บัตร|การ์ด|credit)/i,
  },
  { intent: "donate_refund", re: /(คืนเงิน|ยกเลิก|refund|cancel)/i },
  { intent: "wallet_topup", re: /(เติมเงิน|วอลเล็|wallet|top ?up)/i },

  { intent: "register", re: /(สมัคร|ลงทะเบียน|sign ?up)/i },
  { intent: "writer_upgrade", re: /(นักเขียน|writer|อัปเกรด)/i },
  { intent: "create_novel", re: /(สร้างนิยาย|สร้างเรื่อง|new novel|create)/i },
  { intent: "add_chapter", re: /(เพิ่มตอน|chapter|ตอนใหม่)/i },
  { intent: "manage_library", re: /(คลังของฉัน|library|ติดตาม)/i },
  { intent: "contact", re: /(ติดต่อ|contact|support)/i },
  { intent: "donate_receipt", re: /(ใบเสร็จ|receipt|หลักฐาน|บิล)/i },
  {
    intent: "donate_fail",
    re: /(ชำระเงินไม่สำเร็จ|จ่ายไม่ผ่าน|จ่ายไม่สำเร็จ|payment failed|declined)/i,
  },
  {
    intent: "donate_pending",
    re: /(หักเงินแล้ว|pending|รออัปเดต|สถานะยังไม่ขึ้น)/i,
  },
  { intent: "donate_amount_edit", re: /(แก้ยอด|เปลี่ยนยอด|แก้จำนวนเงิน)/i },
  { intent: "donate_fee", re: /(ค่าธรรมเนียม|fee|คิดค่าบริการ)/i },
  { intent: "donate_privacy", re: /(ปลอดภัย|ข้อมูลบัตร|security|privacy)/i },

  {
    intent: "status_meaning",
    re: /(สถานะนิยาย|ongoing|completed|จบแล้ว|ยังไม่จบ)/i,
  },
  { intent: "rankings_info", re: /(อันดับนิยาย|จัดอันดับ|featured|ranking)/i },

  {
    intent: "chapter_perm",
    re: /(ใคร(เพิ่ม|แก้ไข)ตอน|เพิ่มตอนได้ไหม|สิทธิ์เพิ่มตอน)/i,
  },
  { intent: "delete_novel", re: /(ลบนิยาย|ลบตอน|ลบเรื่อง)/i },

  { intent: "library_add", re: /(เพิ่มลงคลัง|add to library|ติดตามเรื่อง)/i },
  {
    intent: "library_remove",
    re: /(เอาออกจากคลัง|ลบออกจากคลัง|remove from library)/i,
  },

  {
    intent: "reading_nav",
    re: /(ตอน(ถัดไป|ต่อไป)|ตอนก่อนหน้า|next( )?chapter|prev(ious)? chapter)/i,
  },

  {
    intent: "account_edit",
    re: /(แก้(ไข)?โปรไฟล์|เปลี่ยนรูป|แก้นามปากกา|profile)/i,
  },
  { intent: "account_ban", re: /(ระงับบัญชี|แบน|ban|suspend)/i },

  { intent: "contact_support", re: /(ติดต่อ|contact|support|ช่วยเหลือ)/i },
];

// ช่วยหาคำตอบ
function findAnswer(text) {
  // 1) กฎ intent
  for (const r of RULES) {
    if (r.re.test(text)) {
      const hit = FAQ.find((f) => f.id === r.intent);
      if (hit) return { answer: hit.a, intent: r.intent, confidence: 0.95 };
    }
  }
  // 2) คีย์เวิร์ดซับซ้อนนิดหน่อย (ค้นจาก q)
  const norm = (s) => String(s || "").toLowerCase();
  const t = norm(text);
  let best = null;
  for (const f of FAQ) {
    const score = jaccard(norm(f.q), t);
    if (!best || score > best.score) best = { score, f };
  }
  if (best && best.score >= 0.2) {
    return { answer: best.f.a, intent: best.f.id, confidence: best.score };
  }
  // 3) ไม่มั่นใจ → ตอบรวมลิงก์
  return {
    answer:
      "ยังไม่แน่ใจคำถามค่ะ ลองเลือกหัวข้อด้านล่างหรือติดต่อผู้ดูแล: support@example.com",
    intent: "fallback",
    confidence: 0.1,
  };
}

// jaccard แบบง่าย
function jaccard(a, b) {
  const ta = new Set(a.split(/\s+|[,/|]+/).filter(Boolean));
  const tb = new Set(b.split(/\s+|[,/|]+/).filter(Boolean));
  const inter = [...ta].filter((x) => tb.has(x)).length;
  const uni = new Set([...ta, ...tb]).size || 1;
  return inter / uni;
}

router.post("/ask", async (req, res) => {
  try {
    const msg = String(req.body?.message || "");
    if (!msg.trim())
      return res.status(400).json({ message: "message required" });

    const { answer, intent, confidence } = findAnswer(msg);

    // quick replies
    const suggestions = [
      "วิธีโดเนท",
      "ขั้นต่ำเท่าไหร่",
      "จ่ายด้วยอะไรได้บ้าง",
      "เติมเงินทำยังไง",
      "สมัครสมาชิก",
      "สร้างนิยาย",
      "เพิ่มตอนนิยาย",
      "ติดต่อผู้ดูแล",
    ];

    return res.json({ answer, intent, confidence, suggestions });
  } catch (e) {
    console.error("chatbot error", e);
    return res.status(500).json({ message: "chatbot error" });
  }
});

export default router;
