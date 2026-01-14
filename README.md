# Workout API

API REST para gerenciamento de treinos pessoais, substituindo o bloco de notas do celular por uma aplicação organizada em "pastas" de treinos, onde o usuário mantém registro atualizado de cargas, séries e repetições.

## 📋 Descrição

Sistema de gestão de treinos que permite:
- Organizar exercícios em treinos (pastas)
- Manter registro de cargas, séries e repetições atuais
- Consultar a última carga registrada para saber quanto treinar hoje
- Gerenciar catálogo global de exercícios

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido e moderno
- **PostgreSQL** - Banco de dados relacional
- **pg** - Cliente PostgreSQL para Node.js
- **Zod** - Biblioteca de validação de schemas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **Docker** - Containerização da aplicação e banco de dados

## 📦 Pré-requisitos

### Opção 1: Docker (Recomendado)
- Docker e Docker Compose instalados

### Opção 2: Instalação Local
- Node.js (v18 ou superior)
- PostgreSQL (instalado e rodando)
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/workout.git
cd workout
```

### Opção 1: Docker (Recomendado)

2. Configure as variáveis de ambiente (opcional):
Crie um arquivo `.env` na raiz do projeto se quiser customizar:
```env
DB_NAME=workouts
DB_USER=postgres
DB_PASSWORD=postgres
```

**Nota:** Se não criar o `.env`, os valores padrão serão usados.

3. Inicie os containers:
```bash
docker-compose up -d
```

O Docker Compose irá:
- Criar e iniciar o container PostgreSQL
- Criar o banco de dados automaticamente
- Executar o script `init.sql` para criar as tabelas
- Criar e iniciar o container da aplicação Node.js

A aplicação estará disponível em `http://localhost:3001`

### Opção 2: Instalação Local

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=workouts
DB_USER=postgres
DB_PASSWORD=sua_senha
```

4. Crie o banco de dados no PostgreSQL:
```sql
CREATE DATABASE workouts;
```

5. Execute o script SQL:
Execute o arquivo `init.sql` no PostgreSQL, ou copie e execute o conteúdo diretamente no seu cliente PostgreSQL.

## ▶️ Como executar

### Com Docker (Recomendado)

```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar containers
docker-compose down

# Parar e remover volumes (apaga dados)
docker-compose down -v
```

A aplicação estará rodando em `http://localhost:3001`

### Instalação Local

#### Desenvolvimento (com watch):
```bash
npm run dev
```

#### Produção:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
workout/
├── src/
│   ├── database/
│   │   └── database-postgres.js          # Pool de conexão PostgreSQL
│   ├── errors/
│   │   ├── AppError.js                   # Classe base de erros
│   │   ├── ValidationError.js            # Erro de validação (400)
│   │   ├── NotFoundError.js              # Erro de não encontrado (404)
│   │   ├── ConflictError.js              # Erro de conflito (409)
│   │   └── DatabaseError.js              # Erro de banco de dados (500)
│   ├── middleware/
│   │   └── errorHandler.js               # Middleware global de tratamento de erros
│   ├── repositories/
│   │   ├── WorkoutRepository.js          # Lógica de acesso a dados - Treinos
│   │   ├── ExerciseRepository.js         # Lógica de acesso a dados - Exercícios
│   │   └── WorkoutExerciseRepository.js  # Lógica de acesso a dados - Relacionamento
│   ├── routes/
│   │   ├── workoutRoutes.js              # Rotas - Treinos
│   │   ├── exerciseRoutes.js             # Rotas - Exercícios
│   │   └── workoutExerciseRoutes.js      # Rotas - Relacionamento
│   ├── schemas/
│   │   ├── workoutSchemas.js             # Schemas Zod - Treinos
│   │   ├── exerciseSchemas.js            # Schemas Zod - Exercícios
│   │   └── workoutExerciseSchemas.js     # Schemas Zod - Relacionamento
│   └── server.js                          # Arquivo principal (entrada da aplicação)
├── docker-compose.yml                     # Configuração Docker Compose
├── Dockerfile                             # Configuração da imagem Docker
├── .dockerignore                          # Arquivos ignorados no build Docker
├── init.sql                               # Script SQL para criação das tabelas
├── .env                                   # Variáveis de ambiente (não versionado)
├── .gitignore
├── .http                                  # Arquivo para testes REST Client
├── package.json
├── package-lock.json
└── README.md
```

## 🎯 Endpoints da API

### Workouts (Treinos)

- `GET /workouts` - Lista todos os treinos
- `GET /workouts/:id` - Busca treino por ID
- `POST /workouts` - Cria novo treino
- `PUT /workouts/:id` - Atualiza treino
- `DELETE /workouts/:id` - Deleta treino

### Exercises (Exercícios)

- `GET /exercises` - Lista todos os exercícios
- `GET /exercises/:id` - Busca exercício por ID
- `POST /exercises` - Cria novo exercício
- `PUT /exercises/:id` - Atualiza exercício
- `DELETE /exercises/:id` - Deleta exercício

### Workout Exercises (Relacionamento)

- `GET /workouts/:workoutId/exercises` - Lista exercícios de um treino
- `POST /workouts/:workoutId/exercises` - Adiciona exercício ao treino
- `PUT /workouts/:workoutId/exercises/:exerciseId` - Atualiza peso/séries/reps
- `DELETE /workouts/:workoutId/exercises/:exerciseId` - Remove exercício do treino

## 📝 Exemplos de Uso

### Criar um treino:
```bash
POST http://localhost:3001/workouts
Content-Type: application/json

{
    "name": "Treino A - Peito e Tríceps"
}
```

### Criar um exercício:
```bash
POST http://localhost:3001/exercises
Content-Type: application/json

{
    "name": "Supino Reto",
    "muscle_group": "Peito"
}
```

### Adicionar exercício ao treino:
```bash
POST http://localhost:3001/workouts/{workoutId}/exercises
Content-Type: application/json

{
    "exercise_id": "{exerciseId}",
    "weight": 60.5,
    "sets": 3,
    "reps": 12
}
```

### Listar exercícios de um treino:
```bash
GET http://localhost:3001/workouts/{workoutId}/exercises
```

### Atualizar carga/séries/reps:
```bash
PUT http://localhost:3001/workouts/{workoutId}/exercises/{exerciseId}
Content-Type: application/json

{
    "weight": 65.0,
    "sets": 4,
    "reps": 10
}
```

**Nota:** Se estiver usando instalação local, use a porta `3000` em vez de `3001`.

## 🗄️ Estrutura do Banco de Dados

### Tabela: workouts

| Campo      | Tipo        | Descrição                    |
|-----------|-------------|------------------------------|
| id        | UUID        | Identificador único          |
| name      | VARCHAR(255)| Nome do treino               |
| user_id   | UUID        | ID do usuário (futuro)       |
| created_at| TIMESTAMP   | Data de criação              |

**Constraints:** UNIQUE(name, user_id)

### Tabela: exercises

| Campo       | Tipo        | Descrição                    |
|------------|-------------|------------------------------|
| id         | UUID        | Identificador único          |
| name       | VARCHAR(255)| Nome do exercício            |
| muscle_group| VARCHAR(100)| Grupo muscular (opcional)    |
| created_at | TIMESTAMP   | Data de criação              |

**Constraints:** UNIQUE(name)

### Tabela: workout_exercises

| Campo      | Tipo        | Descrição                    |
|-----------|-------------|------------------------------|
| id        | UUID        | Identificador único          |
| workout_id| UUID        | FK para workouts             |
| exercise_id| UUID       | FK para exercises            |
| weight    | DECIMAL(5,2)| Peso (kg)                    |
| sets      | INTEGER     | Número de séries             |
| reps      | INTEGER     | Número de repetições         |
| created_at| TIMESTAMP   | Data de criação              |
| updated_at| TIMESTAMP   | Data de atualização          |

**Constraints:**
- UNIQUE(workout_id, exercise_id) - Não permite exercício duplicado no treino
- CHECK (weight >= 0) - Peso não pode ser negativo
- CHECK (sets >= 1) - Mínimo 1 série
- CHECK (reps >= 1) - Mínimo 1 repetição
- FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
- FOREIGN KEY (exercise_id) REFERENCES exercises(id)

## 🔐 Validações e Regras de Negócio

O projeto utiliza **Zod** para validação de schemas na camada de rotas, garantindo que os dados de entrada estejam corretos antes de serem processados.

### Workouts (Treinos)
- **Validação Zod**: Nome é obrigatório (string não vazia)
- **Regra de negócio**: Não permite treinos com mesmo nome para o mesmo usuário
- **CASCADE delete**: Ao deletar treino, remove exercícios vinculados automaticamente

### Exercises (Exercícios)
- **Validação Zod**: Nome é obrigatório (string não vazia), muscle_group é opcional
- **Regra de negócio**: Nome único global (não pode repetir)

### Workout Exercises (Relacionamento)
- **Validação Zod**: 
  - `exercise_id`: obrigatório (string)
  - `weight`: número >= 0 (não pode ser negativo)
  - `sets`: número >= 1 (mínimo 1 série)
  - `reps`: número >= 1 (mínimo 1 repetição)
- **Regra de negócio**: 
  - Workout e Exercise devem existir
  - Não permite mesmo exercício repetido no mesmo treino
  - Permite atualização parcial (atualizar apenas weight, ou só sets, etc.)

## 📊 Códigos de Status HTTP

- `200` - OK (sucesso)
- `201` - Created (criado com sucesso)
- `204` - No Content (deletado com sucesso)
- `400` - Bad Request (validação falhou)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (duplicado - nome já existe)
- `500` - Internal Server Error (erro interno do servidor)

## 🧪 Testes

O projeto inclui um arquivo `.http` com exemplos de requisições para testar todos os endpoints. Use a extensão REST Client no VS Code ou Thunder Client.

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com watch)

## 🏗️ Arquitetura

O projeto segue o padrão Repository Pattern com tratamento de erros centralizado e validação com Zod:

- **Routes**: Camada de rotas (endpoints HTTP) - recebe requisições, valida com Zod e delega para repositories
- **Schemas**: Definição de schemas Zod para validação de entrada (request.body)
- **Repositories**: Camada de acesso a dados (lógica de banco) - abstrai operações SQL, recebe dados já validados
- **Database**: Configuração de conexão (pool PostgreSQL)
- **Errors**: Classes de erro customizadas para diferentes tipos de falha
- **Middleware**: Tratamento global de erros (errorHandler) - converte erros em respostas HTTP apropriadas

### Fluxo de Validação:

```
Request HTTP → Route (valida com Zod) → Repository (executa query) → Response
                    ↓ (se falhar)
              ValidationError (400)
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👤 Autor

[@greseende](https://github.com/Gustavo-Resende)
