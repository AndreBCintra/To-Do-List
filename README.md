Projeto desenvolvido para uma etapa de seleção.
O projeto contempla o desenvolvimento de um lista de tarefas, na qual o usuário pode acessar a lista, criar uma tarefa, modificar uma tarefa ou excluir a tarefa.
Uma tarefa consiste em alguns campos: título, descrição e status (pendente ou concluída).
Fora isso há funcionalidades para filtrar as tarefas pelo título e pelo status, ordenar as tarefas por título ou data de criação de forma crescente e decrescente.
A aplicação possuí o backend desenvolvido em Node.js com Express e o frontend em Angular. A persistência está sendo feita através de um arquivo csv.
Algumas informações adicionais sobre as funcionalidades é que a aplicação verifica se há um arquivo csv, caso não exista ela cria um para salvar os dados. As tarefas excluídas continuam no arquivo, porém com uma marcação indicando que ela foi excluída, essas tarefas também deixam de aparecer na listagem.
Validações sobre o título da tarefa são feitas.
