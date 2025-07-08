const TaskService = require('../services/tasksService');

async function getTaskList(req, res) {
    try{
        const listaDeTarefas = await TaskService.getAll();
        res.status(200).json(listaDeTarefas);
    } catch(e){
        res.status(500).send("Erro ao recuperar lista de tarefas.")
    }
}

async function createTask(req, res) {
  try {
    const { title, description } = req.body;
    const created = await TaskService.create({title, description});
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function updateTask(req, res) {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Nenhum campo para atualizar.' });
    }

    try {
        const updated = await TaskService.update(taskId, updates);
        return res.status(200).json(updated);
    } catch (e) {
        if (e.message === 'Task not found') {
            return res.status(404).json({ message: e.message });
        }
        return res.status(400).json({ message: e.message });
  }
}

async function deleteTask(req, res) {
    try {
        const { taskId } = req.params;
        const deleted = await TaskService.delete(taskId);
        return res.status(200).json(deleted);
    } catch(e) {
        if (e.message === 'Task not found') {
            return res.status(404).json({ message: e.message });
        }
        return res.status(400).json({ message: e.message });
    }
}

module.exports = { getTaskList, createTask, updateTask, deleteTask }