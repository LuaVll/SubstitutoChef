# SubstitutoChef (Sprint 1)

Assistente de substituição de ingredientes por **função** (gordura, ligação, acidez,
fermento, doçura, espessante, sabor, coquetelaria), voltado para cozinha profissional
(restaurantes, bares, cafeterias, churrascarias).

Nome é provisório — troque em `data/brand.json` quando definir a marca final.

## O que este Sprint 1 já faz
- Chat mobile-first, pensado para uso com uma mão, durante o rush.
- IA raciocina primeiro pela **função** do ingrediente em falta (usando
  `data/knowledge.json` como referência), não só troca A por B.
- Respostas curtas, com 2-3 alternativas e o trade-off de cada uma.
- Identidade visual própria (tema "comanda de cozinha"), sem depender de imagens externas.
- Chave da API protegida em `.env`.

## O que ainda não faz (próximos sprints)
- Personalização por tipo de estabelecimento (bar vs churrascaria vs cafeteria).
- Histórico de conversas / múltiplos usuários por cozinha.
- Qualquer modelo de monetização (freemium, limite de uso, etc.) — ainda é 100% aberto.
- Marca e identidade definitivas.

---

## Passo a passo

### 1. Pré-requisitos
- Node.js 18+ instalado (`node -v` para checar).
- Uma API Key da GROQ: https://console.groq.com/keys

### 2. Onde colar
Copie a pasta `substituto-chef` para onde organiza seus projetos e abra no VS Code.
Estrutura esperada:
```
substituto-chef/
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── data/
│   ├── brand.json
│   └── knowledge.json
└── public/
    └── index.html
```

### 3. Configurar a chave
```bash
cp .env.example .env
```
Abra o `.env` e preencha:
```
GROQ_API_KEY=sua_chave_real_aqui
GROQ_MODEL=llama-3.3-70b-versatile
PORT=3000
```

### 4. Instalar dependências
```bash
npm install
```

### 5. Rodar
```bash
npm start
```
Acesse **http://localhost:3000** — o chat abre com o bordão do produto e já responde
perguntas de substituição.

---

## Como validar este sprint
- [ ] `npm start` roda sem erro.
- [ ] Pergunta tipo "não tenho creme de leite, o que uso no molho branco?" retorna
      2-3 alternativas curtas, com trade-off explicado.
- [ ] A resposta identifica implicitamente a função do ingrediente (não é só uma troca solta).
- [ ] Interface funciona bem no celular (teste redimensionando a janela ou abrindo no
      seu telefone via IP local da rede).

Quando validar, me chama que seguimos para o próximo sprint: podemos trabalhar
diferenciação por tipo de estabelecimento, refinar o tom por perfil de usuário
(chef vs auxiliar iniciante), ou já pensar no modelo de monetização com mais
substância (agora que o produto existe de verdade pra testar com alguém).
