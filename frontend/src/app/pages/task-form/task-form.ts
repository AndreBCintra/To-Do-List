import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../services/task';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm implements OnInit {
  taskId: string | null = null;
  taskData = {
    title: '',
    description: ''
  };
  isEdit = false;
  loading = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.taskId;

    if (this.isEdit && this.taskId) {
      this.loading = true;
      this.taskService.getOne(this.taskId).subscribe({
        next: (task) => {
          if (!task) {
            alert('Tarefa não encontrada');
            this.router.navigate(['/']);
            return;
          }
          this.taskData.title = task.title;
          this.taskData.description = task.description;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Erro ao carregar tarefa');
        }
      });
    }
  }

  salvar(): void {
    if (!this.taskData.title.trim()) {
      alert('O título é obrigatório');
      return;
    }

    if (this.isEdit && this.taskId) {
      this.taskService.update(this.taskId, {
        title: this.taskData.title,
        description: this.taskData.description
      }).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => alert('Erro ao atualizar tarefa')
      });
    } else {
      this.taskService.create(this.taskData).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => alert('Erro ao criar tarefa')
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }
}
