# API Chamado (Ticket)

API REST para gerenciamento de chamados (tickets) de suporte, construída com Node.js, Express e MySQL. Inclui geração e validação de JWT para rotas protegidas, validações de entrada e mensagens de erro padronizadas.

## Tecnologias

- Node.js + Express
- MySQL (`mysql2/promise`)
- JSON Web Tokens (`jsonwebtoken`)
- (opcional) `bcrypt` para hash de senhas

## Recursos

- Criação de chamados (tickets)
- Listagem e buscas por vários critérios (equipamento, departamento, nome/data, public_id)
- Atendimento de chamados (rota protegida por JWT)
- Cancelamento de chamados
- Login que gera token JWT com validade de 30 minutos
- Validações de entrada centralizadas em `src/validation/*`

## Estrutura principal do projeto

- `src/connection/conexao.js` — Pool MySQL
- `src/Router/rotas.routes.js` — definição das rotas
- `src/service/servico.js` — lógica dos endpoints (tickets)
- `src/service/fazerLogin.js` — endpoint de login (gera token)
- `src/service/gerandoTocken.js` — função que gera o JWT (30m)
- `src/security/validacaoLogin.js` — verifica JWT
- `src/middlewares/login.js` — middleware que protege rotas
- `src/validation/*` — regras de validação (nome, departamento, palavrões, etc.)
- `src/lib/error/mensagensError.js` — mensagens padrão de erro

## Variáveis de ambiente

Crie um arquivo `.env` (ou configure as variáveis no ambiente do servidor) com pelo menos:

```
DB_HOST=localhost
DB_PORT=<o número da porta do seu banco de dados>
DB_USER=<usuario_db>
DB_PASSWORD=<senha_db>
DB_DATABASE=<database>
TOKEN=<chave_secreta_jwt>
```

- `TOKEN` deve ser a chave secreta usada para assinar e verificar JWTs (string segura). Não coloque um JWT inteiro aqui.

## Como rodar (local)

1. Instale dependências:

```powershell
npm install
```

2. Execute em modo dev (conforme seu `package.json`):

```powershell
npm run dev
```

3. Endpoints disponíveis (principais):

- `POST /cadastro` — criar novo ticket
- `GET /tickets` — listar todos
- `GET /buscarIdEquipamento` — buscar por id do equipamento (body com `IdEquipamento`)
- `POST /departamento` — buscar por departamento
- `POST /status` — buscar por status
- `POST /buscarnomedata` — buscar por nome e data
- `POST /ticket` — buscar por `public_id`
- `POST /login` — gera token JWT (body: `{ usuario, senha }`)
- `PATCH /atendendoTicket` — rota protegida (usar header `Authorization: Bearer <token>`) para atualizar atendimento
- `PATCH /cancelarTicket` — cancelar ticket

> Observação: confira nomes exatos das rotas no arquivo `src/Router/rotas.routes.js`.

## Exemplo: login e uso do token

1) Requisição para obter token:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"coloca o usuário que você criou no banco de dados","senha":"a senha que está no seu banco de dados que você criou"}'
```

Resposta esperada:

```json
{ "token": "<JWT-AQUI>" }
```

2) Usar o token em rota protegida:

```bash
curl -X PATCH http://localhost:3000/atendendoTicket \
  -H "Authorization: Bearer <JWT-AQUI>" \
  -H "Content-Type: application/json" \
  -d '{"buscarId":"<public_id>", "respostaDoSuporte":"Resposta...", "status":"Resolvido"}'
```

## Segurança e recomendações

- Nunca armazene senhas em texto no banco de dados. Use `bcrypt` para hashear senhas.
- `TOKEN` deve ser uma string forte e mantida fora do repositório.
- Use HTTPS em produção.
- Considere implementar refresh token se quiser renovar sessão sem login frequente.

## Próximos passos sugeridos

- Migrar senhas para hash com `bcrypt` e alterar `FazerLogin` para `bcrypt.compare`.
- Criar tabela separada `usuarios` (se ainda não existir) e usar essa tabela para autenticação.
- Padronizar responses de erro (mesmo formato JSON para erros e sucessos).
- Adicionar testes automatizados (unit/integration) para endpoints críticos.

## Contribuindo

1. Abra uma issue descrevendo a alteração.
2. Crie um branch com um nome descritivo.
3. Faça PR com descrição clara do que foi alterado.

---