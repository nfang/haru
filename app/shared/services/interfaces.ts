import { Injectable } from '@angular/core';
import { Task } from '../task.model';

export interface ITaskService {
  list(): Task[];
  add(task: Task): number;
  remove(task: Task): Task[];
  update(task: Task): Task;
}
