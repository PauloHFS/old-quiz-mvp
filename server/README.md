# Server

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
# ou
yarn
```

### 2. Iniciar o banco de dados

Primeira vez:

```bash
docker run --name quiz-mvp-db \
-p 5432:5432 \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=postgres \
-d postgres
```

Demais vezes:

```bash
docker start quiz-mvp-db
```

### 2. Rodar o servidor

```bash
npm run dev
# ou
yarn dev
```
