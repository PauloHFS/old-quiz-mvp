# Quiz MVP

DB Diagram: <https://dbdiagram.io/d/quiz-mvp-65469f307d8bbd64657d9310>

## Server

### Como rodar localmente

#### 1. Instalar dependências

```bash
npm install
# ou
yarn
```

#### 2. Iniciar o banco de dados

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

#### 3. Rodar o servidor

```bash
npm run dev
# ou
yarn dev
```

### Specs da API

Você pode utilizar o [bruno](https://www.usebruno.com) como client para testar a API.
