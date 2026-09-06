const produtos = [
  {
    "id": 1788718905763,
    "nome": "Bota Texana Marrom",
    "preco": 189.9,
    "imagem": "https://raw.githubusercontent.com/bgxsites-bot/topcountry/main/1788718901498-img_1849.jpeg",
    "descricao": "Couro legítimo - Top Country Capelinha",
    "categoria": "Botas",
    "ordem": 1788718905763
  }
];
if(typeof window!=='undefined'){window.produtos=produtos; localStorage.setItem('tc_produtos',JSON.stringify(produtos));}