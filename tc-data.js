const SUPABASE_URL = "https://hdflyxsygkxpveyjtsan.supabase.co";
const SUPABASE_KEY = "sb_publishable_jT6Lm8ABbiFTw_9r-XtmKA_w5R2qJm_";

async function getProdutosDaNuvem() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/produtos?select=*&order=ordem.asc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// Deixa disponível globalmente pro index.html
window.getProdutosDaNuvem = getProdutosDaNuvem;
window.carregarProdutosDaNuvem = getProdutosDaNuvem;
