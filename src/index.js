const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//checa se o usuário buscado existe - FUNCIONANDO
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);

  if(!user) {
    return response.status(400).json({ error: "User not found!" })
  }

  request.user = user;
  return next();
}

//criação de usuário - FUNCIONANDO
app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const usernameAlreadyExists = users.some(
    (user) => user.username = username
  );

  if(usernameAlreadyExists) {
    return response.status(400).json(
      { error: "Username already exists!" }
    )
  };

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })

  return response.status(201).send();
});

//busca a lista de tarefas do usuário - FUNCIONANDO
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

//cria uma tarefa - FUNCIONANDO
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const createTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    created_at: new Date()
  };

  user.todos.push(createTodo);

  return response.status(201).send();
});

//alteração de title e deadline - NÃO FUNCIONANDO
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline} = request.body;
  const { user } = request;

  user.todos.todo.title = title;
  user.todos.todo.deadline = deadline;

  return response.status(201).send();
});

//alteração do done
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { done } = request.body;
  const { user } = request;

  user.todos.todo.done = done;

  return response.status(201).send();
});

//apaga a tarefa
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;