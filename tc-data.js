// tc-data.js - SUPABASE REAL - Top Country
const SUPABASE_URL = "https://hdlyxsiygkxpvveyjtsm.supabase.co";
const SUPABASE_KEY = "sb_publishable_jT6Lm8ABbiFTw_9r-XtmKA_w5R2qJm_";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let cfg = {
  hero_titulo: "Top Country",
  hero_tagline: "Moda Country",
  hero_subtitulo: "O melhor do country",
  hero_imagem: "",
  whatsapp: "5538999999999"
};
let produtos = [];

async function uploadImagem(file){
  if(!file) return "";
  const nome = Date.now()+"_"+file.name.replace(/\s/g,"_").replace(/[^a-zA-Z0-9_.-]/g,"");
  const {error} = await sb.storage.from('topcountry').upload(nome,file);
  if(error) throw error;
  const {data} = sb.storage.from('topcountry').getPublicUrl(nome);
  return data.publicUrl;
}

async function loadData(){
  try{
    const {data:cfgDb} = await sb.from('config').select('*').eq('id',1).single();
    if(cfgDb){ cfg = {...cfg,...cfgDb}; }
    const {data:prodDb} = await sb.from('produtos').select('*').order('ordem',{ascending:true});
    if(prodDb) produtos = prodDb;
    if(typeof renderSite==='function') renderSite(cfg,produtos);
    if(typeof window.render==='function') window.render();
  }catch(e){ console.error("loadData", e) }
}
document.addEventListener('DOMContentLoaded',loadData);
window.loadData=loadData;
window.getCfg=()=>cfg;
window.getProdutos=()=>produtos;
window.sb=sb;
window.uploadImagem=uploadImagem;
