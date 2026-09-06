// Camada de dados do site Top Country.
// Cole aqui a URL e a chave "anon public" do seu projeto Supabase quando tiver.
// Sem isso, tudo funciona salvando no navegador (localStorage).
export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';

const LS_PRODUCTS = 'tc_products';
const LS_CONFIG = 'tc_config';
const LS_CREDS = 'tc_admin_creds';

export const CATEGORIAS = ['Masculino', 'Feminino', 'Infantil', 'Botas', 'Acessórios', 'Bonés', 'Fivelas'];

export const DEFAULT_CONFIG = {
  heroTitle: 'TOP COUNTRY',
  heroTagline: 'Seu estilo. Sua essência. Seu jeito country.',
  heroSubtitle: 'Moda country para quem carrega personalidade em cada detalhe.',
  heroImage: 'assets/images/hero/hero.jpg',
  whatsapp: '5533991791610'
};

export const DEFAULT_PRODUCTS = [
  { id: 'p1', nome: 'Boné Trucker All Terrain', categoria: 'Acessórios', preco: null, imagem: 'assets/images/masculino/produto-01.jpg' },
  { id: 'p2', nome: 'Botina Chelsea em Couro', categoria: 'Botas', preco: null, imagem: 'assets/images/botas/produto-02.jpg' },
  { id: 'p3', nome: 'Chapéu Country Aba Larga', categoria: 'Acessórios', preco: null, imagem: 'assets/images/acessorios/produto-03.jpg' },
  { id: 'p4', nome: 'Body Manga Longa Country', categoria: 'Feminino', preco: null, imagem: 'assets/images/feminino/produto-04.jpg' },
  { id: 'p5', nome: 'Cinto de Couro com Fivela', categoria: 'Acessórios', preco: null, imagem: 'assets/images/acessorios/produto-05.jpg' },
  { id: 'p6', nome: 'Boné Aba Curva Bordado', categoria: 'Acessórios', preco: null, imagem: 'assets/images/masculino/produto-06.jpg' },
  { id: 'p7', nome: 'Botina Casual Couro Camurça', categoria: 'Botas', preco: null, imagem: 'assets/images/infantil/produto-07.jpg' },
  { id: 'p8', nome: 'Look Feminino Jeans + Botina', categoria: 'Feminino', preco: null, imagem: 'assets/images/feminino/produto-08.jpg' }
];

function client() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !window.supabase) return null;
  if (!window.__tcSb) window.__tcSb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return window.__tcSb;
}
export function usingSupabase() { return !!client(); }

export async function getConfig() {
  const sb = client();
  if (sb) {
    const { data } = await sb.from('config').select('*').eq('id', 1).maybeSingle();
    if (data) return { heroTitle: data.hero_titulo, heroTagline: data.hero_tagline, heroSubtitle: data.hero_subtitulo, heroImage: data.hero_imagem, whatsapp: data.whatsapp };
  }
  try { return { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem(LS_CONFIG) || '{}') }; } catch (e) { return { ...DEFAULT_CONFIG }; }
}

export async function saveConfig(cfg) {
  const sb = client();
  if (sb) {
    await sb.from('config').upsert({ id: 1, hero_titulo: cfg.heroTitle, hero_tagline: cfg.heroTagline, hero_subtitulo: cfg.heroSubtitle, hero_imagem: cfg.heroImage, whatsapp: cfg.whatsapp, updated_at: new Date().toISOString() });
    return;
  }
  localStorage.setItem(LS_CONFIG, JSON.stringify(cfg));
}

export async function listProducts() {
  const sb = client();
  if (sb) {
    const { data } = await sb.from('produtos').select('*').order('ordem', { ascending: true });
    if (data) return data.map(d => ({ id: d.id, nome: d.nome, categoria: d.categoria, preco: d.preco, imagem: d.imagem }));
  }
  try {
    const raw = localStorage.getItem(LS_PRODUCTS);
    return raw ? JSON.parse(raw) : DEFAULT_PRODUCTS.slice();
  } catch (e) { return DEFAULT_PRODUCTS.slice(); }
}

export async function saveProduct(p) {
  const sb = client();
  if (sb) {
    const row = { nome: p.nome, categoria: p.categoria, preco: p.preco || null, imagem: p.imagem };
    if (p.id) row.id = p.id;
    const { data } = await sb.from('produtos').upsert(row).select().maybeSingle();
    return data;
  }
  const list = await listProducts();
  if (p.id) {
    const i = list.findIndex(x => x.id === p.id);
    if (i > -1) list[i] = p; else list.push(p);
  } else {
    p.id = 'p' + Date.now();
    list.push(p);
  }
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(list));
  return p;
}

export async function deleteProduct(id) {
  const sb = client();
  if (sb) { await sb.from('produtos').delete().eq('id', id); return; }
  const list = (await listProducts()).filter(x => x.id !== id);
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(list));
}

export function resizeImage(file, maxW, quality) {
  maxW = maxW || 1280; quality = quality || 0.82;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getCreds() {
  try { return JSON.parse(localStorage.getItem(LS_CREDS)) || { user: 'admin', pass: 'top2024' }; }
  catch (e) { return { user: 'admin', pass: 'top2024' }; }
}
export function setCreds(user, pass) {
  localStorage.setItem(LS_CREDS, JSON.stringify({ user, pass }));
}
export function checkAuth(user, pass) {
  const c = getCreds();
  return user === c.user && pass === c.pass;
}
