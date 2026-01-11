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
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📦 Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL (instalado e rodando)
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/workout.git
cd workout
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=workout
DB_USER=postgres
DB_PASSWORD=sua_senha
```

4. Crie o banco de dados no PostgreSQL:
```sql
CREATE DATABASE workout;
```

5. Execute os scripts SQL para criar as tabelas:

```sql
-- Tabela de Treinos
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    user_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, user_id)
);

-- Tabela de Exercícios
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    muscle_group VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Relacionamento (Treino-Exercício)
CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id),
    weight DECIMAL(5,2) NOT NULL CHECK (weight >= 0),
    sets INTEGER NOT NULL CHECK (sets >= 1),
    reps INTEGER NOT NULL CHECK (reps >= 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workout_id, exercise_id)
);
```

## ▶️ Como executar

### Desenvolvimento (com watch):
```bash
npm run dev
```

### Produção:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
workout/
├── src/
│   ├── database/
│   │   └── database-postgres.js          # Pool de conexão
│   ├── repositories/
│   │   ├── WorkoutRepository.js          # Lógica de acesso a dados - Treinos
│   │   ├── ExerciseRepository.js         # Lógica de acesso a dados - Exercícios
│   │   └── WorkoutExerciseRepository.js  # Lógica de acesso a dados - Relacionamento
│   ├── routes/
│   │   ├── workoutRoutes.js              # Rotas - Treinos
│   │   ├── exerciseRoutes.js             # Rotas - Exercícios
│   │   └── workoutExerciseRoutes.js      # Rotas - Relacionamento
│   └── server.js                          # Arquivo principal
├── .env                                   # Variáveis de ambiente (não versionado)
├── .gitignore
├── .http                                  # Arquivo para testes REST Client
├── package.json
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
POST http://localhost:3000/workouts
Content-Type: application/json

{
    "name": "Treino A - Peito e Tríceps"
}
```

### Criar um exercício:
```bash
POST http://localhost:3000/exercises
Content-Type: application/json

{
    "name": "Supino Reto",
    "muscle_group": "Peito"
}
```

### Adicionar exercício ao treino:
```bash
POST http://localhost:3000/workouts/{workoutId}/exercises
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
GET http://localhost:3000/workouts/{workoutId}/exercises
```

### Atualizar carga/séries/reps:
```bash
PUT http://localhost:3000/workouts/{workoutId}/exercises/{exerciseId}
Content-Type: application/json

{
    "weight": 65.0,
    "sets": 4,
    "reps": 10
}
```

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

### Workouts (Treinos)
- Nome é obrigatório
- Não permite treinos com mesmo nome para o mesmo usuário
- CASCADE delete: ao deletar treino, remove exercícios vinculados automaticamente

### Exercises (Exercícios)
- Nome é obrigatório
- Nome único global (não pode repetir)
- Muscle_group é opcional

### Workout Exercises (Relacionamento)
- Workout e Exercise devem existir
- Não permite mesmo exercício repetido no mesmo treino
- Weight >= 0 (não pode ser negativo)
- Sets >= 1 (mínimo 1 série)
- Reps >= 1 (mínimo 1 repetição)
- Permite atualização parcial (atualizar apenas weight, ou só sets, etc.)

## 📊 Códigos de Status HTTP

- `200` - OK (sucesso)
- `201` - Created (criado com sucesso)
- `204` - No Content (deletado com sucesso)
- `400` - Bad Request (validação falhou)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (duplicado - nome já existe)

## 🧪 Testes

O projeto inclui um arquivo `.http` com exemplos de requisições para testar todos os endpoints. Use a extensão REST Client no VS Code ou Thunder Client.

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com watch)

## 🏗️ Arquitetura

O projeto segue o padrão Repository Pattern:
- **Routes**: Camada de rotas (endpoints HTTP)
- **Repositories**: Camada de acesso a dados (lógica de banco)
- **Database**: Configuração de conexão (pool)

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
