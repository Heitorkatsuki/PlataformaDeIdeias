# Plataforma de Ideias - MVP

## Requisitos

- Node.js
- MongoDB rodando localmente ou URI de cluster

## Instalação

1. clone o repositório
2. `npm install`
3. copie `.env.example` para `.env` e ajuste:
   - MONGODB_URI
   - SESSION_SECRET
4. `npm start`
5. Acesse http://localhost:3000

## Funcionalidades

- Cadastro / Login (bcrypt + sessions)
- CRUD de ideias (somente autor pode editar/excluir)
- Votação (um voto por usuário/ideia) — integridade garantida por índice único composto
- Lista ordenada por votos (aggregation)
- Helmet, CSRF, express-flash
