require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const brand = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'brand.json'), 'utf-8'));
const knowledge = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'knowledge.json'), 'utf-8'));

// Monta o bloco de categorias funcionais como texto, para injetar no system prompt.
function montarBaseDeConhecimento() {
  return knowledge.categorias_de_funcao
    .map(
      (c) =>
        `- ${c.funcao} (ex: ${c.exemplos}): ${c.papel} Lógica de troca: ${c.logica_de_troca}`
    )
    .join('\n');
}

function montarSystemPrompt() {
  return `
Você é o ${brand.produto}, assistente de cozinha profissional especializado em substituição de ingredientes.

PÚBLICO: ${brand.publico}

TOM DE VOZ:
${brand.tom_de_voz}

REGRAS DE COMPORTAMENTO (siga sempre):
${brand.regras_de_comportamento.map((r) => `- ${r}`).join('\n')}

COMO RACIOCINAR:
Antes de responder, identifique a FUNÇÃO do ingrediente que está em falta, usando as categorias abaixo como referência. Um ingrediente pode ter mais de uma função — nesse caso, avise qual delas está sendo priorizada na sugestão.

${montarBaseDeConhecimento()}
`.trim();
}

app.get('/api/greeting', (req, res) => {
  res.json({ greeting: brand.bordao });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'O campo "messages" deve ser uma lista.' });
    }

    const payload = {
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: montarSystemPrompt() },
        ...messages,
      ],
      temperature: 0.4,
    };

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!groqResponse.ok) {
      const erro = await groqResponse.text();
      console.error('Erro da GROQ API:', erro);
      return res.status(502).json({ error: 'Erro ao consultar o modelo de IA.' });
    }

    const data = await groqResponse.json();
    const resposta = data.choices?.[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';

    res.json({ reply: resposta });
  } catch (err) {
    console.error('Erro no /api/chat:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${brand.produto} rodando em http://localhost:${PORT}`);
});
