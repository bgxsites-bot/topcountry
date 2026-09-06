# Ligar o painel admin ao Supabase (opcional)

Sem isso, o painel `/Admin.dc.html` já funciona salvando no navegador (localStorage) — dá pra usar hoje mesmo. Ligar ao Supabase faz os dados aparecerem para **todo mundo** que visita o site, de **qualquer dispositivo**.

## 1. Criar o projeto
Crie uma conta grátis em supabase.com → "New project". Anote a **Project URL** e a chave **anon public** (Project Settings → API).

## 2. Rodar este SQL
Cole no SQL Editor do Supabase e execute:

```sql
create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text not null,
  preco numeric,
  imagem text,
  ordem int default 0,
  criado_em timestamptz default now()
);

create table if not exists config (
  id int primary key default 1,
  hero_titulo text,
  hero_tagline text,
  hero_subtitulo text,
  hero_imagem text,
  whatsapp text,
  updated_at timestamptz default now()
);
insert into config (id) values (1) on conflict (id) do nothing;

alter table produtos enable row level security;
alter table config enable row level security;

-- Leitura pública (o site precisa ler sem login)
create policy "produtos leitura publica" on produtos for select using (true);
create policy "config leitura publica" on config for select using (true);

-- Escrita pública (o painel admin usa só usuário/senha simples, não login do Supabase)
create policy "produtos escrita publica" on produtos for all using (true) with check (true);
create policy "config escrita publica" on config for all using (true) with check (true);
```

Atenção: as políticas acima liberam escrita para quem tiver a chave anônima (que fica visível no HTML do site). Isso é aceitável para uma loja pequena com painel protegido por senha, mas não é segurança de verdade — qualquer pessoa que inspecionar o código consegue escrever na tabela. Se isso for um problema, me avise que trocamos por autenticação real do Supabase.

## 3. Colar as chaves
Abra `tc-data.js` na raiz do projeto e preencha as duas linhas do topo:

```js
export const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
export const SUPABASE_ANON_KEY = 'sua-chave-anon-public-aqui';
```

Pronto — o site e o painel passam a usar o Supabase automaticamente, sem mexer em mais nada.
