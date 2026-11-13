/*
  CONTEÚDO DO PORTFÓLIO
  ---------------------
  Para acrescentar itens, copie um bloco e preencha.

  confirmado: true  -> aparece na versão enviada (link normal).
  confirmado: false -> só aparece no modo rascunho (abra a página com ?rascunho no fim do link),
                       com um carimbo "a confirmar".

  Campos vazios ("") simplesmente não aparecem na página.
*/

/* slides("pasta", n) -> ["assets/img/carrosseis/pasta/01.jpg", ...] */
const slides = (pasta, n) => Array.from({ length: n }, (_, i) => `assets/img/carrosseis/${pasta}/${String(i + 1).padStart(2, "0")}.jpg`);

window.PORTFOLIO = {
  pessoa: {
    nome: "Beatriz Chianello",
    linha: "Redação, fotografia e direção criativa",
    email: "beatrizchianello.media@gmail.com",
    linkedin: "https://www.linkedin.com/in/beatrizchianello",
    substack: "https://fakeblondelovesyou.substack.com/",
    curriculo: "assets/docs/Curriculo-Beatriz-Chianello.pdf",
    curriculoNome: "Curriculo-Beatriz-Chianello.pdf",
  },

  /* ---------- TEXTOS AUTORAIS (página Textos) ---------- */
  autorais: {
    publicacao: "Fake Blonde Loves You",
    plataforma: "Substack",
    logo: "assets/img/marca/fake-blonde-logo.png",
    credito: "Texto, fotografia e edição: Beatriz Chianello",
    descricao: [
      "Fake Blonde Loves You é uma revista viva em primeira pessoa. Nasceu no caderno e virou coluna, seção e recorte: um jeito de organizar o que eu noto quando o mundo não está reparando.",
      "No Monologue ficam os textos longos, como ensaios, crônicas e cartas. No Archive, um inventário de fragmentos: obsessões, lugares, livros, filmes e playlists.",
    ],
    assinatura: "and remember, Fake Blonde loves you.",
    textos: [
      {
        titulo: "Eu que sempre fui rosa",
        subtitulo: "sobre flores e as crianças que esperam",
        data: "2026-05-21",
        capa: "assets/img/textos/eu-que-sempre-fui-rosa.jpg",
        trecho:
          "Cresci achando que aniversário era sempre assim: barulhento, festivo, compartilhado. Só mais tarde percebi que o que eu sentia era outra coisa.",
        link: "https://fakeblondelovesyou.substack.com/p/eu-que-sempre-fui-rosa",
        confirmado: true,
      },
      {
        titulo: "archive #1 — um começo nada vazio",
        subtitulo: "da sala de cinema à mesa de cabeceira.",
        data: "2026-05-07",
        capa: "assets/img/textos/archive-1.jpg",
        trecho:
          "Só cheguei agora porque estava esperando a digitalização do filme analógico — sorry, demora. Vinte e cinco dias para virar isso aqui.",
        link: "https://fakeblondelovesyou.substack.com/p/archive-1",
        confirmado: true,
      },
      {
        titulo: "a revista que eu queria ler, então escrevi",
        subtitulo: "uma primeira palavra sobre a mulher loira (falsa).",
        data: "2026-04-25",
        capa: "assets/img/textos/loira-falsa.jpg",
        trecho: "Isto aqui não é um perfil de internet. É uma revista viva em primeira pessoa.",
        link: "https://fakeblondelovesyou.substack.com/p/loira-falsa",
        confirmado: true,
      },
    ],
  },

  /* ---------- OUTROS TEXTOS (redação para empresas) ---------- */
  outros: [
    {
      id: "diario",
      nome: "Diário do Transporte",
      contexto: "Tryvia",
      nota: "Artigos escritos durante o meu trabalho no marketing da Tryvia, empresa de tecnologia para o transporte rodoviário, e publicados no Diário do Transporte.",
      credito: "Redação: Beatriz Chianello · Conteúdo: Tryvia · Publicação: Diário do Transporte",
      textos: [
        {
          titulo: "Fadiga, sono e decisão: por que saúde mental também é uma questão de gestão de frota",
          data: "2026-09-17",
          trecho: "Planejamento de escalas e videotelemetria ajudam a reduzir jornadas exaustivas, identificar sinais de fadiga e transformar o cuidado com o motorista em prática de gestão.",
          link: "https://diariodotransporte.com.br/2026/09/17/fadiga-sono-e-decisao-por-que-saude-mental-tambem-e-uma-questao-de-gestao-de-frota/",
          confirmado: true,
        },
        {
          titulo: "O que as férias escolares revelam sobre a operação do transporte",
          data: "2026-07-17",
          trecho: "Com expectativa de aproximadamente 3,3 milhões de passageiros no transporte interestadual, julho amplia a demanda e exige ajustes de frota, escala e planejamento.",
          link: "https://diariodotransporte.com.br/2026/07/17/o-que-as-ferias-escolares-revelam-sobre-a-operacao-do-transporte/",
          confirmado: true,
        },
        {
          titulo: "Maio Amarelo 2026 começa sob alerta: alta projetada de mortes expõe fragilidade estrutural da segurança viária",
          data: "2026-05-22",
          trecho: "O Maio Amarelo de 2026 começa com projeção de alta nos acidentes. Entender por que exige olhar além dos cartazes — e dentro da operação.",
          link: "https://diariodotransporte.com.br/2026/05/22/maio-amarelo-2026-comeca-sob-alerta-alta-projetada-de-mortes-expoe-fragilidade-estrutural-da-seguranca-viaria/",
          confirmado: true,
        },
        {
          titulo: "Alta do diesel pressiona transporte de passageiros e expõe fragilidade do setor",
          data: "2026-04-27",
          trecho: "Escalada dos preços do combustível, impulsionada por tensões geopolíticas, reduz margens, limita investimentos e acelera a adoção de tecnologias de eficiência operacional no setor.",
          link: "https://diariodotransporte.com.br/2026/04/27/alta-do-diesel-pressiona-transporte-de-passageiros-e-expoe-fragilidade-do-setor/",
          confirmado: true,
        },
      ],
    },
  ],

  /* ---------- FOTOGRAFIA ANALÓGICA ---------- */
  fotografia: {
    ficha: "35mm · Canon Prima Super 105u · Fujifilm ISO 400",
    /* Ordem = ordem da galeria. lugar, data e filme aparecem quando preenchidos. */
    fotos: [
      "foto-11", "foto-04", "foto-02", "foto-18", "foto-05", "foto-10", "foto-07", "foto-03", "foto-06", "foto-01",
      "foto-12", "foto-14", "foto-13", "foto-17", "foto-08", "foto-09", "foto-15", "foto-16", "foto-19", "foto-20",
    ].map((arquivo) => ({ arquivo, lugar: "", data: "", filme: "", confirmado: true })),
  },

  /* ---------- TRABALHOS ---------- */
  /* tipo "social": abre com texto e cases por cliente, cada um num carrossel.
     tipo "projeto": capa + apresentação; ao abrir, galeria na largura inteira.
     emBreve: true -> card com selo "Em breve", sem abrir. */
  trabalhos: [
    {
      id: "social",
      tipo: "social",
      titulo: "Social Media & Content",
      papel: "KIKI Studios · planejamento, redação e produção de conteúdo",
      mosaico: ["assets/img/social/pcd-remada.jpg", "assets/img/carrosseis/bm-enxergar/01.jpg", "assets/img/social/tryvia-transporte.jpg"],
      texto: [
        "Criei a KIKI Studios. É um estúdio de conteúdo, audiovisual e branding. Meu trabalho em social media passa pelo planejamento de pautas, pela redação e pela produção de conteúdo para redes. Abaixo, reuni alguns trabalhos.",
      ],
      /* Cada peça tem um id fixo e um tipo:
           imagem    -> { tipo: "imagem", src }
           video     -> { tipo: "video", src (arquivo do vídeo), capa (imagem) }
           carrossel -> { tipo: "carrossel", slides: [imagens...], capa (opcional; padrão = 1º slide) }
         A prévia editável (ferramentas/servidor_edicao.py) troca arquivos e capas, adiciona,
         remove e reordena peças e slides sem mexer aqui; o resultado vai para ajustes.js. */
      cases: [
        {
          cliente: "PCD em Movimento",
          descricao: "Projeto social de esporte adaptado. Conteúdo, comunicação das ações e cobertura audiovisual.",
          pecas: [
            { id: "pcd-luta", tipo: "carrossel", slides: slides("pcd-luta", 10), alt: "Carrossel: uma história de luta que continua sendo escrita (21 de setembro)" },
            { id: "pcd-libras", tipo: "carrossel", slides: slides("pcd-libras", 5), alt: "Carrossel: você sabia que existem centenas de línguas de sinais no mundo?" },
            { id: "pcd-remada", tipo: "imagem", src: "assets/img/social/pcd-remada.jpg", alt: "Post com atleta: mas o que tem de tão especial em um dia de remada?" },
            { id: "pcd-vem-passar", tipo: "imagem", src: "assets/img/social/pcd-vem-passar-um-dia.jpg", alt: "Story: vem passar um dia com a gente" },
            { id: "pcd-arraia", tipo: "imagem", src: "assets/img/social/pcd-arraia.jpg", alt: "Story: da canoa pro arraiá, especial festa junina" },
            { id: "pcd-remos", tipo: "imagem", src: "assets/img/social/pcd-remos.jpg", alt: "Story: remos, canoas e encontros" },
          ],
        },
        {
          cliente: "Bem Morar Arquitetura",
          descricao: "Escritório de arquitetura. Planejamento editorial e produção de conteúdo para redes sociais.",
          pecas: [
            { id: "bm-enxergar", tipo: "carrossel", slides: slides("bm-enxergar", 7), alt: "Carrossel: como você começa a enxergar o seu projeto antes da obra?" },
            { id: "bm-crenca", tipo: "carrossel", slides: slides("bm-crenca", 5), alt: "Carrossel: você não precisa de uma casa maior ou definitiva" },
            { id: "bm-criancas", tipo: "carrossel", slides: slides("bm-criancas", 6), alt: "Carrossel de Dia das Crianças: vale a pena pensar em um quarto infantil" },
            { id: "bm-duvida", tipo: "carrossel", slides: slides("bm-duvida", 5), alt: "Carrossel: preciso trocar todos os móveis?" },
            { id: "bm-professores", tipo: "carrossel", slides: slides("bm-professores", 9), alt: "Carrossel de Dia dos Professores: coisas que todo professor tem em casa" },
            { id: "bm-vaso", tipo: "imagem", src: "assets/img/social/bm-vaso.jpg", alt: "Post de ambientação com vaso e flores" },
          ],
        },
        {
          cliente: "Tryvia",
          descricao: "Tecnologia para o transporte rodoviário. Conteúdo para Instagram e LinkedIn, comunicação interna e institucional, como analista de marketing.",
          pecas: [
            { id: "tryvia-transporte", tipo: "imagem", src: "assets/img/social/tryvia-transporte.jpg", alt: "Post: coisas que só quem vive o transporte percebe" },
            { id: "tryvia-ferias", tipo: "imagem", src: "assets/img/social/tryvia-ferias.jpg", alt: "Post: férias escolares não mudam só a rotina das famílias" },
            { id: "tryvia-operacao", tipo: "imagem", src: "assets/img/social/tryvia-operacao.jpg", alt: "Post: a operação pensada para ser perfeita" },
            { id: "tryvia-rotina", tipo: "imagem", src: "assets/img/social/tryvia-rotina.jpg", alt: "Story: o melhor da rotina são as pessoas" },
            { id: "tryvia-pascoa", tipo: "imagem", src: "assets/img/social/tryvia-pascoa.jpg", alt: "Story de endomarketing: nesta Páscoa, espalhe gestos" },
            { id: "tryvia-cafe", tipo: "imagem", src: "assets/img/social/tryvia-cafe.jpg", alt: "Story: café com propósito" },
          ],
        },
        {
          cliente: "Flávia Vasconcelos · Curadoria em Viagem",
          descricao: "Série de vídeos verticais da cobertura da viagem: edição, roteiro de montagem, trilha e legendas, um episódio por dia.",
          pecas: [
            { id: "fv-ep01", tipo: "video", src: "assets/video/flavia/fv-ep01.mp4", capa: "assets/video/flavia/fv-ep01.jpg", alt: "Episódio 1: Ilhabela" },
            { id: "fv-ep02", tipo: "video", src: "assets/video/flavia/fv-ep02.mp4", capa: "assets/video/flavia/fv-ep02.jpg", alt: "Episódio 2: Ilhabela" },
            { id: "fv-ep03", tipo: "video", src: "assets/video/flavia/fv-ep03.mp4", capa: "assets/video/flavia/fv-ep03.jpg", alt: "Episódio 3: recap de Ilhabela" },
            { id: "fv-ep04", tipo: "video", src: "assets/video/flavia/fv-ep04.mp4", capa: "assets/video/flavia/fv-ep04.jpg", alt: "Episódio 4: São Paulo" },
          ],
        },
      ],
      confirmado: true,
    },
    {
      id: "ollie",
      tipo: "projeto",
      titulo: "Ollie",
      papel: "Direção de arte · campanha acadêmica",
      capa: "assets/img/trabalhos/ollie-capa.jpg",
      capaFormato: "retrato",
      resumo:
        "Campanha para uma marca vegana de protetor solar que ainda não refletia a pluralidade de quem a consome: cinco peles, cinco idades, cinco texturas de cabelo.",
      texto: [
        "A Ollie se posiciona como uma marca consciente, mas pouco representativa. A campanha parte desse gap: construir uma comunicação que finalmente fizesse sentido para esse público, reconhecendo diferentes histórias, corpos e vivências.",
        "O universo visual vem da propaganda de cosmético dos anos 80: luz de estúdio limpa, cor sólida como fundo, sorriso sem pose, retrato frontal que lembra foto de família. Amarelo Ollie como marca-registro, tons pastel nas roupas e composição em grade, sem hierarquia entre pele e mercadoria.",
        "Slogan: “Proteja cada tom. Valoriza cada história.”",
      ],
      galeria: [],
      links: [],
      confirmado: true,
    },
    {
      id: "nars",
      tipo: "projeto",
      titulo: "NARS",
      papel: "Fashion film · TCC",
      capa: "assets/img/trabalhos/nars-capa.jpg",
      resumo: "Pesquisa sobre como as pessoas interpretam um fashion film pensado para a NARS.",
      emBreve: true,
      confirmado: true,
    },
  ],
};

/* Modo rascunho: acrescente ?rascunho ao endereço para ver também os itens a confirmar. */
window.RASCUNHO = new URLSearchParams(location.search).has("rascunho");
window.visivel = (item) => window.RASCUNHO || item.confirmado === true;
