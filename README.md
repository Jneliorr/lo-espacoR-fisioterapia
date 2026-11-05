# Clínica Espaço R

Site institucional estático em português, com os tons de verde da identidade fornecida: verde petróleo `#07534f`, verde folha `#78b94d`, verde claro `#c5e29c` e fundo `#f7f7ef`. HTML5, CSS3 e JavaScript nativos. Sem framework, instalação ou build para utilizar.

## Abrir

Abra `index.html` diretamente no navegador. Para visualizar via HTTP, na pasta do projeto:

```sh
python -m http.server 8080
```

Acesse `http://localhost:8080`. Publique o conteúdo da raiz em qualquer hospedagem estática. Este repositório guarda o código; sua criação não ativa automaticamente GitHub Pages ou um domínio público.

## Estrutura

- `index.html`: página principal com abertura, navegação, hero, essência, benefícios, sobre, abordagem, modalidades, galeria, avaliações, primeiros passos, convite, FAQ, localização e rodapé.
- `privacidade.html`: descrição dos recursos utilizados e serviços externos.
- `css/`: estilos principais, animações e responsividade.
- `js/config.js`: contato, Instagram, Maps, mensagem e tour opcional.
- `js/main.js`: menu acessível, contato contextual, progresso de leitura e abertura de sessão.
- `js/gallery.js`: lightbox nativo com navegação, Escape, fundo externo e retorno de foco.
- `js/animations.js`: revelações por Intersection Observer.
- `js/webgl.js`: shaders GLSL nativos, baixa resolução, limite de 24 fps, pausa fora da viewport/aba e alternativa estática.
- `assets/`: imagens locais, logo original e favicon.
- `tools/`: verificação estática e preparação de domínio.

## Fontes de conteúdo e imagens

Pesquisa realizada em 05/11/2026:

1. **Logo e lista de serviços:** imagens fornecidas pelo usuário, preservadas em `assets/logo/logo-original.png` e `assets/images/servicos-oficiais.png`.
2. **Instagram oficial:** <https://www.instagram.com/espacor_fisioestetica/>. O HTML público confirmou o perfil. O acesso às publicações foi limitado pelo Instagram (HTTP 429); não foi possível analisar o feed ou baixar suas fotos. Não foram utilizados cookies privados ou técnicas para contornar esse limite. A página direciona para o Instagram oficial.
3. **Fotografias reais alternativas:** cadastro da própria clínica em <https://totalpass.com/br/academias/clinica-espaco-r/>. `clinica-2.jpg`: acessórios e espelho; `clinica-3.jpg`: sala e aparelho; `clinica-4.jpg`: aparelho de Pilates. Fontes identificadas junto à galeria. Não são imagens ilustrativas nem fotografias extraídas do Instagram. As fotos do cadastro podem ser antigas; confirmar atualização com a clínica.
4. **Telefone e endereço:** cadastro vinculado ao mesmo Instagram em <https://wellhub.com/pt-br/search/partners/espaco-r-centro/>. Telefone `(21) 97216-5509` e endereço `Rua Pedro Marquês Rosa, 02 — Centro, Itaboraí, RJ`. O endereço também consta na TotalPass; o telefone foi corroborado pelo cadastro empresarial <https://www.solutudo.com.br/empresas/rj/itaborai/fisioterapia/r-k-bessa-da-costa-fisioterapia-8802903>. Confirmar atualidade antes de campanhas comerciais.
5. **Maps:** o link fornecido <https://maps.app.goo.gl/UWZRt281mYaTSqfA6> redireciona para **Espaço R** e foi mantido. O outro link do briefing, `tN3W5ofFWuzVF7uN8`, redireciona para **Studio Passos Pilates em Itaboraí**, outro estabelecimento, e foi descartado.

O briefing é referência de implementação, não comprovação de qualificações. Não foram inventados depoimentos, notas, profissionais, registros, números de alunos, resultados, planos ou preços. AeroNeoPilates não aparece na lista oficial fornecida; por isso não foi anunciado como serviço confirmado. Os serviços complementares reproduzem a imagem enviada, com orientação para consultar indicação e disponibilidade. O comparador opcional não foi incluído porque não há pares de imagens apropriados. Não há vídeo ou tour oficial confirmado para incorporar.

## Alterar contato e mídias

Edite `js/config.js`. O WhatsApp possui mensagem codificada e contexto por modalidade. Se `whatsapp` estiver vazio, os links com JavaScript passam a apontar para o Instagram. Para alterar o telefone definitivamente, atualize também os links HTML de fallback, o texto visível e os dados estruturados do `index.html`.

Preencha `tour360` somente com uma URL HTTPS oficial confirmada: o bloco de tour é exibido automaticamente. Sem URL ele permanece oculto, sem botão inativo. Para usar fotos novas, adicione arquivos locais, altere os `src`, os links da galeria, as dimensões, os textos alternativos e as atribuições.

## Domínio e SEO

Title, description, Open Graph descritivo, idioma, headings e dados estruturados estão presentes. Canonical, Open Graph com imagem absoluta e sitemap dependem de um domínio real. Após defini-lo, execute:

```sh
node tools/configure-domain.mjs https://seu-dominio-confirmado.com.br
node tools/verify.mjs
```

O comando gera `sitemap.xml`, atualiza `robots.txt`, canonical e Open Graph das páginas. Sem um domínio informado, nenhum domínio fictício é publicado.

## Verificação

```sh
node tools/verify.mjs
```

Verifica referências locais, âncoras, IDs duplicados, dimensões/alt das imagens, HTTPS, links externos, JSON-LD, sintaxe dos scripts e configuração de contato. Node é usado apenas nas ferramentas opcionais de manutenção. O site não depende dele.

Checklist de navegador antes de publicação: desktop e telas de 320, 390 e 768 px; menu por toque e teclado; galeria com setas/Escape e retorno de foco; accordion; links de WhatsApp/Instagram/Maps; JavaScript desativado; preferência por movimento reduzido; perda de WebGL; leitura sem overflow horizontal.

Validação realizada: verificador estático aprovado; respostas HTTP 200 para a página inicial, privacidade e mapa incorporado; testes DOM temporários com Happy DOM aprovados para abertura/fechamento do menu, Escape e foco, links contextuais, alternativa Instagram sem telefone, ciclo de imagens da galeria, retorno de foco, tour oculto e movimento reduzido. As dependências temporárias estão em `.qa/`, ignoradas pelo Git. Testes DOM não verificam renderização, GPU ou o comportamento nativo de Escape do diálogo. A inspeção visual automatizada ficou indisponível porque a ferramenta de controle do navegador interrompeu a sessão por não conseguir confirmar a URL; portanto o checklist visual acima ainda deve ser realizado antes de uma publicação comercial.

## Acessibilidade, privacidade e desempenho

### Revisão da prévia

A abertura recebeu fundo verde claro `#d4e5c3`, e a fotografia da seção sobre foi substituída por `clinica-3.jpg`. Em 05/11/2026, o perfil oficial do Google Maps (<https://maps.app.goo.gl/UWZRt281mYaTSqfA6>) foi acessado diretamente e confirmou nota 5,0 com 12 avaliações, além do telefone e endereço já utilizados. Foram incluídos dois trechos curtos de comentários públicos de Ana Paula Silva de Araujo e NELSON, com atribuição, indicação de trecho e links para a fonte. A nota é uma fotografia da data de consulta, sem sincronização automática. Não foram reproduzidos relatos clínicos detalhados ou dados de saúde dos avaliadores.

A camada WebGL da abertura foi desativada em `css/refinements.css` para manter o fundo verde uniforme solicitado; o script não inicia quando o canvas está oculto. A revisão visual desktop confirmou o fundo, a foto nova e os dois cards, sem rolagem horizontal no tamanho conferido. Os testes de estrutura e interações continuam aprovados.

Conteúdo e FAQ continuam acessíveis sem JavaScript, menu possui alternativa sem scripts e links de fotos abrem os originais. Há skip link, foco visível, imagens com dimensões, lazy loading secundário e diálogo modal nativo. Animações respeitam `prefers-reduced-motion`; WebGL não inicia nessa preferência. O efeito para ao sair da viewport ou ocultar a aba. Não há coleta de formulários, analytics, pixels, login ou pagamentos. Fontes e mapa utilizam os serviços externos do Google, descritos na página de privacidade.
