# Aplicação de Folha de Ponto

Este projeto é uma aplicação de folha de ponto com um banco de dados PostgreSQL.

## Pré-requisitos

- Docker
- Docker Compose

## Começando

1. Clone o repositório:

   ```
   git clone https://github.com/alexandrehrt/timesheet.git
   cd timesheet
   ```

2. Inicie a aplicação:

   ```
   docker-compose up
   ```

   Este comando irá:

   - Construir a imagem da aplicação
   - Iniciar o banco de dados PostgreSQL
   - Iniciar o servidor da aplicação

3. Acesse a aplicação:
   Quando os contêineres estiverem em execução, você poderá acessar a aplicação em:
   ```
   http://localhost:3000
   ```

## Parando a Aplicação

Para parar a aplicação e remover os contêineres, use:

```
docker-compose down
```

Para parar a aplicação e remover os contêineres junto com os volumes, use:

```
docker-compose down -v
```
