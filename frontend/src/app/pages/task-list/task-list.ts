import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Task, TaskService } from '../../services/task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss']
})
export class TaskList implements OnInit {
  loading = false;
  orderAsc = true;
  orderByTitle = false;
  filterStatus: 'all' | 'pending' | 'done' = 'all';
  searchTerm: string = '';

  allTasks: Task[] = [];
  tasks: Task[] = [];

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.loading = true;
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.allTasks = data;
        this.applyFilters(); // aplica filtros sobre a lista original
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Erro ao carregar tarefas.');
      },
    });
  }

  toggleStatus(task: Task): void {
    const newStatus = task.status === 'pending' ? 'done' : 'pending';
    this.taskService.update(task.id, { status: newStatus }).subscribe({
      next: () => this.fetchTasks(),
      error: () => alert('Erro ao atualizar status.'),
    });
  }

  deleteTask(task: Task): void {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    this.taskService.delete(task.id).subscribe({
      next: () => this.fetchTasks(),
      error: () => alert('Erro ao excluir.'),
    });
  }

  editTask(task: Task): void {
    this.router.navigate([task.id, 'edit']);
  }

  newTask(): void {
    this.router.navigate(['/new']);
  }

  toggleOrderField() {
    this.orderByTitle = !this.orderByTitle;
    this.sortTasks();
  }

  toggleOrderDirection() {
    this.orderAsc = !this.orderAsc;
    this.sortTasks();
  }

  sortTasks() {
    const field = this.orderByTitle ? 'title' : 'createdAt';
    this.tasks.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      const compare = typeof aVal === 'string'
        ? aVal.localeCompare(bVal)
        : new Date(aVal).getTime() - new Date(bVal).getTime();

      return this.orderAsc ? compare : -compare;
    });
  }

  applyFilters(): void {
    this.tasks = this.allTasks.filter(task => {
      if (this.filterStatus !== 'all' && task.status !== this.filterStatus) return false;
      if (this.searchTerm.trim() && !task.title.toLowerCase().includes(this.searchTerm.toLowerCase())) return false;
      return true;
    });

    this.sortTasks();
  }

  onStatusFilterChange(status: 'all' | 'pending' | 'done') {
    this.filterStatus = status;
    this.applyFilters();
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }
}
