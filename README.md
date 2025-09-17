# Produtos API — REST em Node/Express com Prisma + PostgreSQL (Neon)

Uma **API REST simples** em **Node.js + Express** com **CRUD** para o modelo **Produto**. A persistência é feita com **Prisma ORM** e **PostgreSQL** (recomendado usar o **Neon** no plano gratuito).

> Campos do modelo `Produto`:
>
> - `id` (Int, PK, autoincremento)
> - `nome` (String)
> - `fotoUrl` (String)
> - `preco` (Decimal — serializado como `string` no JSON)

---

## 🔧 Requisitos
- Node.js 18+
- npm (ou yarn)
- Banco PostgreSQL acessível (ex.: **Neon**)

---

## 🚀 Como rodar localmente

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Crie o arquivo `.env`** (baseado em `.env.example`) com a URL do seu banco (Neon pooler):
   ```env
   DATABASE_URL="postgresql://<user>:<pass>@<host-pooler>/<db>?sslmode=require&channel_binding=require"
   # Opcional, caso use Prisma Migrate com conexão direta
   DIRECT_URL="postgresql://<user>:<pass>@<host>/<db>?sslmode=require&channel_binding=require"
   ```

3. **Gere o client do Prisma e aplique migrações**
   ```bash
   npx prisma generate
   npx prisma migrate dev -n init
   ```

4. **Inicie em desenvolvimento**
   ```bash
   npm run dev
   # Servidor em http://localhost:4000
   ```

> Porta: a aplicação usa `process.env.PORT` (padrão `4000`).

---

## 📚 Endpoints
Prefixo base (exemplo): `http://localhost:4000`

### Criar produto
`POST /produtos`
```json
{
  "nome": "Camiseta",
  "fotoUrl": "https://exemplo.com/camiseta.jpg",
  "preco": "99.90"
}
```
**Respostas**
- `201 Created` com JSON do produto criado e header `Location: /produtos/{id}`
- `400 Bad Request` se faltar campos obrigatórios

### Listar produtos
`GET /produtos`
- `200 OK` → `[{ id, nome, fotoUrl, preco }]`

### Buscar por id
`GET /produtos/:id`
- `200 OK` → `{ id, nome, fotoUrl, preco }`
- `400 Bad Request` se `id` inválido
- `404 Not Found` se não existir

### Atualizar
`PUT /produtos/:id`
```json
{
  "nome": "Camiseta Premium",
  "fotoUrl": "https://exemplo.com/camiseta2.jpg",
  "preco": "129.90"
}
```
**Respostas**
- `200 OK` com JSON atualizado
- `400 Bad Request` se `id` inválido
- `404 Not Found` se não existir

### Apagar
`DELETE /produtos/:id`
- `204 No Content` em caso de sucesso
- `400 Bad Request` se `id` inválido
- `404 Not Found` se não existir

---

## 🧩 Stack e estrutura
- **Express** — servidor HTTP e roteamento
- **Prisma ORM** — schema, migrações e client tipado
- **PostgreSQL (Neon)** — banco gerenciado com pooler e SSL

Estrutura (simplificada):
```
src/
  index.ts            # bootstrap (usa PORT)
  prisma.ts           # instância única do PrismaClient
  routers/
    produtosRouter.ts # rotas CRUD do Produto
prisma/
  schema.prisma       # modelo Produto e datasource
```

No `schema.prisma`, o campo monetário usa Decimal mapeado para Postgres:
```prisma
model Produto {
  id      Int     @id @default(autoincrement())
  nome    String
  fotoUrl String
  preco   Decimal @db.Decimal(10, 2)

  @@map("produtos")
}
```

> **Nota**: na API, `preco` é serializado como `string` para evitar perda de precisão.

---

## 🌐 Deploy (Render)

Há um `render.yaml` de exemplo que configura um **Web Service (free)**. Passos gerais:
1. Suba o código no GitHub.
2. No painel do Render: **New → Web Service → Deploy an existing repo** (ele lê o `render.yaml`).
3. Defina as variáveis `DATABASE_URL` (e `DIRECT_URL` opcional) em **Environment**.

Build/Start esperados:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

> Plano free pode hibernar (cold start). Use a região `sa-east-1` para menor latência com Neon em São Paulo.

---

## 🧪 Testando via `curl`

```bash
# Criar
curl -X POST http://localhost:4000/produtos \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Camiseta","fotoUrl":"https://x/c.jpg","preco":"99.90"}'

# Listar
curl http://localhost:4000/produtos

# Buscar 1
curl http://localhost:4000/produtos/1

# Atualizar
curl -X PUT http://localhost:4000/produtos/1 \
  -H 'Content-Type: application/json' \
  -d '{"preco":"129.90"}'

# Apagar
curl -X DELETE http://localhost:4000/produtos/1
```

---

## 🔐 Boas práticas
- Mantenha `.env` fora do Git (use `.env.example`).
- Use a URL **pooler** do Neon com `sslmode=require&channel_binding=require`.
- Em produção, prefira `npm run build` + `node dist/index.js` (sem `ts-node`).

---

## 📄 Licença
MIT