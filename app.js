// ===== CONFIGURAÇÃO INICIAL =====
// Pegue sua chave gratuita em: http://www.omdbapi.com/apikey.aspx
const CHAVE_API = "44b65c3d";
const URL_BASE = "https://www.omdbapi.com/";

// ===== CONEXÃO COM O HTML =====
const campoBusca = document.getElementById("campo-busca");
const listaResultados = document.getElementById("lista-resultados");
const mensagemStatus = document.getElementById("mensagem-status");

// ===== VARIÁVEIS DE CONTROLE =====
let termoBusca = "";      // Texto digitado pelo usuário
let paginaAtual = 1;      // Página de resultados (a API retorna 10 por página)
let modoBusca = "filme";      

// ===== FUNÇÃO DO BOTÃO "BUSCAR" =====
function buscarFilmes() {
  termoBusca = campoBusca.value.trim(); // remove espaços extras
  paginaAtual = 1;                      // sempre começa da página 1
  modoBusca = "filme";                   
  pesquisarFilmes();                    // chama a função que faz a requisição
}

// ===== FUNÇÃO DO BOTÃO "PRÓXIMA PÁGINA" =====
function proximaPagina() {
  paginaAtual++;
  if (modoBusca === "filme") {
    pesquisarFilmes();
  } else {
    pesquisarFilmesPorAtor();
  }
}

// ===== FUNÇÃO DO BOTÃO "ANTERIOR" =====
function paginaAnterior() {
   if (paginaAtual > 1) {
    paginaAtual--;
    if (modoBusca === "filme") {
      pesquisarFilmes();
    } else {
      pesquisarFilmesPorAtor();
    }
  }
}

// ===== FUNÇÃO PRINCIPAL DE PESQUISA =====
async function pesquisarFilmes() {
  // Valida se o campo está vazio
  if (!termoBusca) {
    mensagemStatus.textContent = "Digite o nome de um filme para pesquisar.";
    listaResultados.innerHTML = "";
    return;
  }

  // Mostra mensagem de carregando
  mensagemStatus.textContent = "🔄 Buscando filmes, aguarde...";
  listaResultados.innerHTML = "";

  try {
    // Monta a URL com a chave e o termo buscado
    const url = `${URL_BASE}?apikey=${CHAVE_API}&s=${encodeURIComponent(termoBusca)}&page=${paginaAtual}`;
    
    alert(url);

    // Faz a chamada na API
    const resposta = await fetch(url);
    const dados = await resposta.json();

    // Verifica se encontrou algo
    if (dados.Response === "False") {
      mensagemStatus.textContent = "Nenhum resultado encontrado.";
      listaResultados.innerHTML = "";
      return;
    }

    // Mostra os filmes na tela
    exibirFilmes(dados.Search);
    mensagemStatus.textContent = `Página ${paginaAtual} — mostrando resultados para "${termoBusca}"`;

  } catch (erro) {
    console.error(erro);
    mensagemStatus.textContent = "❌ Erro ao buscar dados. Verifique sua conexão.";
  }
}

// ===== FUNÇÃO PARA MOSTRAR FILMES =====
function exibirFilmes(filmes) {
  listaResultados.innerHTML = ""; // limpa os resultados anteriores

  filmes.forEach(filme => {
    // Cria o container do card
    const div = document.createElement("div");
    div.classList.add("card");

    // Se não houver pôster, usa uma imagem padrão
    const poster = filme.Poster !== "N/A"
      ? filme.Poster
      : "https://via.placeholder.com/300x450?text=Sem+Poster";

    // Monta o HTML do card
    div.innerHTML = `
      <img src="${poster}" alt="Pôster do filme ${filme.Title}">
      <h3>${filme.Title}</h3>
      <p>Ano: ${filme.Year}</p>
    `;

    // Adiciona o card dentro da lista
    listaResultados.appendChild(div);
  });
}

//Bucar filme por atores



// Função para buscar filmes de um ator
const CHAVE_API_ATOR = "740c868ae156da5bdc7834ad4fbe7b29";
const URL_BASE_ATOR = "https://api.themoviedb.org/3";

const campoBuscaAtor = document.getElementById("campo-busca-ator");
const mensagemStatusAtor = document.getElementById("mensagem-status-ator");


function buscarAtor() {
  termoBusca = campoBuscaAtor.value.trim();
  paginaAtual = 1;
  modoBusca = "ator";
  pesquisarFilmesPorAtor();
}

async function pesquisarFilmesPorAtor() {
  if (!termoBusca) {
    mensagemStatusAtor.textContent = "Digite o nome de um ator para pesquisar.";
    listaResultados.innerHTML = "";
    return;
  }

 mensagemStatusAtor.textContent = "🔄 Buscando filmes, aguarde...";
  listaResultados.innerHTML = "";

  try {
    // 1️⃣ Buscar o ator pelo nome
    const urlPessoa = `${URL_BASE_ATOR}/search/person?api_key=${CHAVE_API_ATOR}&language=pt-BR&query=${encodeURIComponent(termoBusca)}&page=${paginaAtual}`;
    const respostaPessoa = await fetch(urlPessoa);
    const dadosPessoa = await respostaPessoa.json();

    if (dadosPessoa.results.length === 0) {
      mensagemStatusAtor.textContent = "Nenhum ator encontrado.";
      return;
    }

    const ator = dadosPessoa.results[0];
    const atorId = ator.id;

    // 2️⃣ Buscar os filmes do ator
    const urlFilmes = `${URL_BASE_ATOR}/person/${atorId}/movie_credits?api_key=${CHAVE_API_ATOR}&language=pt-BR`;
    const respostaFilmes = await fetch(urlFilmes);
    const dadosFilmes = await respostaFilmes.json();

    if (!dadosFilmes.cast || dadosFilmes.cast.length === 0) {
      mensagemStatusAtor.textContent = `Nenhum filme encontrado para ${ator.name}.`;
      return;
    }

    exibirFilmes(dadosFilmes.cast, ator.name);
   mensagemStatusAtor.textContent = `🎬 Mostrando filmes com ${ator.name}`;

  } catch (erro) {
    console.error(erro);
    mensagemStatusAtor.textContent = "❌ Erro ao buscar dados. Verifique sua conexão.";
  }
}

// ===== FUNÇÃO PARA MOSTRAR FILMES =====
function exibirFilmes(filmes, nomeAtor) {
  listaResultados.innerHTML = "";

  filmes.forEach(filme => {
    const div = document.createElement("div");
    div.classList.add("card");

    const poster = filme.poster_path
      ? `https://image.tmdb.org/t/p/w300${filme.poster_path}`
      : "https://via.placeholder.com/300x450?text=Sem+Poster";

    div.innerHTML = `
      <img src="${poster}" alt="Pôster de ${filme.title}">
      <h3>${filme.title}</h3>
      <p>Ano: ${filme.release_date ? filme.release_date.slice(0,4) : "Sem data"}</p>
      <p><small>Personagem: ${filme.character || "Desconhecido"}</small></p>
    `;

    listaResultados.appendChild(div);
  });
}