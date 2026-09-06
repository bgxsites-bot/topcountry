const SUPABASE_URL = "https://hdflyxsygkxpveyjtsan.supabase.co";
const SUPABASE_KEY = "sb_publishable_jT6Lm8ABbiFTw_9r-XtmKA_w5R2qJm_";

export async function getConfig(){
  return {
    whatsapp:"5533991791610",
    waHero:"5533991791610",
    waShop:"5533991791610",
    waFloat:"5533991791610"
  };
}

export async function getProdutos(){
  try{
    const res = await fetch(`${SUPABASE_URL}/rest/v1/produtos?select=*&order=ordem.asc`,{
      headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}
    });
    const data = await res.json();
    return data.map(p=>({
      id:p.id,
      nome:p.nome,
      titulo:p.nome,
      preco:p.preco,
      price:p.preco,
      imagem:p.imagem,
      image:p.imagem,
      foto:p.imagem,
      descricao:p.descricao,
      categoria:p.categoria,
      ...p
    }));
  }catch(e){
    console.error(e);
    return [];
  }
}

export const getData = getProdutos;
export const getProducts = getProdutos;
