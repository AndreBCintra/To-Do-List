const path = require('path');
const fs = require('fs-extra');
const csvParser = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const FILE = path.join(__dirname, '..', 'data', 'tasks.csv');
const HEADERS = [
  { id: 'id', title: 'id' },
  { id: 'title', title: 'title' },
  { id: 'description', title: 'description' },
  { id: 'status', title: 'status' },
  { id: 'isDeleted', title: 'isDeleted' },
  { id: 'createdAt', title: 'createdAt' },
  { id: 'updatedAt', title: 'updatedAt' },
];

class TaskService{
    async _ensureFile() {
        await fs.ensureFile(FILE);
        const stats = await fs.stat(FILE);
        if (stats.size === 0) {
            await fs.writeFile(
            FILE,
            HEADERS.map(h => h.title).join(',') + '\n'
            );
        }
    }  

    async _load() {
        await this._ensureFile();
        return new Promise((resolve, reject) => {
            const tasks = [];

            fs.createReadStream(FILE)
            .pipe(csvParser())
            .on('data', data => tasks.push(data))
            .on('end', () => resolve(tasks))
            .on('error', reject);
        });
    }

    async _save(tasks) {
        await this._ensureFile();
        const tmpPath = FILE + '.tmp';

        const csvWriter = createObjectCsvWriter({
            path: tmpPath,
            header: HEADERS,
        });

        await csvWriter.writeRecords(tasks);

        await fs.rename(tmpPath, FILE);
    }

    async getAll() {
        const tasks = await this._load();
        return tasks.filter(t => t.isDeleted === '0');
    }

    async create({title, description}) {
        if (!title) {
            throw new Error('title obrigatório');
        }
        const tasks = await this._load();

        const now = new Date().toISOString();

        const newTask = {
            id: Date.now().toString(),
            title,
            description: description ?? '',
            status: 'pending',
            isDeleted: '0',
            createdAt: now,
            updatedAt: now,
        };

        tasks.push(newTask);
        await this._save(tasks);

        return newTask;
    }

    async update(id, updates) {
        const tasks = await this._load();
        const idx = tasks.findIndex(t => t.id === id && t.isDeleted === '0');
        if (idx === -1) throw new Error('Task not found');

        const task = tasks[idx];

        if (updates.title !== undefined) {
            if (updates.title == "") throw new Error('title obrigatório');
            task.title = updates.title;
        }
        if (updates.description !== undefined) {
            task.description = updates.description;
        }
        if (updates.status !== undefined) {
            if (!['pending', 'done'].includes(updates.status))
            throw new Error('status inválido');
            task.status = updates.status;
        }

        task.updatedAt = new Date().toISOString();
        await this._save(tasks);
        return task;
    }

    async delete(id) {
        const tasks = await this._load();
        const idx = tasks.findIndex(t => t.id === id && t.isDeleted === '0');
        if (idx === -1) throw new Error('Task not found');

        const task = tasks[idx];

        task.isDeleted = '1';

        task.updatedAt = new Date().toISOString();
        await this._save(tasks);
        return task;
    }
}

module.exports = new TaskService();