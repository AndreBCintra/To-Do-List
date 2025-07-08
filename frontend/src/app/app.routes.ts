import { Routes } from '@angular/router';
import { TaskList } from './pages/task-list/task-list';
import { TaskForm } from './pages/task-form/task-form';

export const routes: Routes = [
  { path: '', component: TaskList },
  { path: 'new', component: TaskForm },
  { path: ':id/edit', component: TaskForm },
];