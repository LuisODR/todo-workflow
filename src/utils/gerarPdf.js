const A4_W = 210, A4_H = 297, MAR = 12;
const INNER_W = A4_W - MAR * 2;
const FOTO_GAP = 6, FOTO_W = (INNER_W - FOTO_GAP) / 2, FOTO_H = 100;

function getSessionUser() {
  try {
    const session = JSON.parse(localStorage.getItem("tw_session") ?? "null");
    if (!session?.userId) return null;
    return JSON.parse(localStorage.getItem("tw_users") ?? "[]").find((u) => u.id === session.userId) ?? null;
  } catch { return null; }
}

function registrarAcaoPdf(paginas, numMoedas) {
  try {
    const user = getSessionUser();
    const entrada = { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, ts: new Date().toISOString(), userId: user?.id ?? "anonimo", userName: user?.name ?? "Usuário", type: "pdf_gerado", label: `Gerou PDF com ${paginas} página${paginas !== 1 ? "s" : ""} e ${numMoedas} moeda${numMoedas !== 1 ? "s" : ""}`, meta: { paginas, moedas: numMoedas } };
    const raw = localStorage.getItem("tw_action_log");
    const log = raw ? JSON.parse(raw) : [];
    localStorage.setItem("tw_action_log", JSON.stringify([entrada, ...log].slice(0, 500)));
  } catch {}
}

function carregarImagem(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao carregar imagem."));
    img.src = dataUrl;
  });
}
function detectarFormato(dataUrl) {
  if (dataUrl.startsWith("data:image/png")) return "PNG";
  if (dataUrl.startsWith("data:image/webp")) return "WEBP";
  return "JPEG";
}
function fitDims(nW, nH, mW, mH) { const r = Math.min(mW / nW, mH / nH); return { w: nW * r, h: nH * r }; }

async function adicionarPaginaImagem(doc, dataUrl) {
  const img = await carregarImagem(dataUrl);
  const { w, h } = fitDims(img.naturalWidth, img.naturalHeight, A4_W, A4_H);
  doc.addImage(dataUrl, detectarFormato(dataUrl), (A4_W - w) / 2, (A4_H - h) / 2, w, h);
}

async function adicionarFotoMoeda(doc, dataUrl, x, y) {
  if (dataUrl) {
    const img = await carregarImagem(dataUrl);
    const { w, h } = fitDims(img.naturalWidth, img.naturalHeight, FOTO_W, FOTO_H);
    doc.addImage(dataUrl, detectarFormato(dataUrl), x + (FOTO_W - w) / 2, y + (FOTO_H - h) / 2, w, h);
  } else {
    doc.setFillColor(240, 240, 240); doc.setDrawColor(200, 200, 200);
    doc.roundedRect(x, y, FOTO_W, FOTO_H, 3, 3, "FD");
    doc.setFontSize(9); doc.setTextColor(160, 160, 160);
    doc.text("Sem foto", x + FOTO_W / 2, y + FOTO_H / 2, { align: "center" });
  }
}

function adicionarSpecs(doc, texto, yInicio) {
  doc.setFontSize(9);
  if (!texto?.trim()) { doc.setTextColor(180, 180, 180); doc.text("Sem especificações.", MAR, yInicio); return; }
  doc.setTextColor(40, 40, 40);
  doc.text(doc.splitTextToSize(texto, INNER_W), MAR, yInicio, { lineHeightFactor: 1.4 });
}

export async function gerarPdf({ bannerPrincipal, subBanner, moedas = [], bannerFooter, onProgress }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const totalEtapas = 2 + moedas.length + (bannerFooter ? 1 : 0);
  let etapa = 0;
  const avancar = () => { etapa++; onProgress?.(Math.round((etapa / totalEtapas) * 100)); };

  if (bannerPrincipal) { await adicionarPaginaImagem(doc, bannerPrincipal); }
  else { doc.setFontSize(14); doc.setTextColor(180,180,180); doc.text("Banner Principal não inserido", A4_W/2, A4_H/2, { align:"center" }); }
  avancar();

  doc.addPage();
  if (subBanner) { await adicionarPaginaImagem(doc, subBanner); }
  else { doc.setFontSize(14); doc.setTextColor(180,180,180); doc.text("Sub-banner não inserido", A4_W/2, A4_H/2, { align:"center" }); }
  avancar();

  for (const moeda of moedas) {
    doc.addPage();
    doc.setFillColor(255,255,255); doc.rect(0,0,A4_W,A4_H,"F");
    await adicionarFotoMoeda(doc, moeda.fotoFrente, MAR, MAR);
    await adicionarFotoMoeda(doc, moeda.fotoVerso, MAR + FOTO_W + FOTO_GAP, MAR);
    const yL = MAR + FOTO_H + 5;
    doc.setDrawColor(220,220,220); doc.setLineWidth(0.3); doc.line(MAR, yL, A4_W-MAR, yL);
    adicionarSpecs(doc, moeda.specs, yL + 8);
    avancar();
  }

  if (bannerFooter) { doc.addPage(); await adicionarPaginaImagem(doc, bannerFooter); avancar(); }

  doc.save(`catalogo-moedas-${new Date().toISOString().slice(0,10)}.pdf`);
  registrarAcaoPdf(totalEtapas, moedas.length);
}
