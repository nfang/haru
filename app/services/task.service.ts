import { TASKS } from './mock-tasks';
import { Task } from '../models/task';
import { Injectable } from 'angular2/core';

@Injectable()
export class TaskService {
  listTasks (): Task[] {
    return TASKS;
  }

  addTask(task: Task) {
    return TASKS.push(task);
  }
}
