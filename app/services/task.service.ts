import { TaskProvider } from './mock-tasks';
import { Task } from '../models/task';
import { Injectable } from 'angular2/core';

@Injectable()
export class TaskService {

  private _taskProvider: TaskProvider;

  constructor(taskProvider: TaskProvider) {
    this._taskProvider = taskProvider;
  }

  list(): Task[] {
    return this._taskProvider.tasks;
  }

  add(task: Task) {
    return this._taskProvider.tasks.push(task);
  }

  remove(task: Task) {    
     var index = this._taskProvider.tasks.indexOf(task);
     console.log(index);
     if (index < 0) {
       throw new Error('Task not found');
     }
     this._taskProvider.tasks.splice(index, 1);
     return this._taskProvider.tasks;
  }

  /**
   * Update an existing task
   * @param  {Task}   task The task with changes
   * @return {Task}        The updated task
   */
  update(task: Task): Task {
    if (!task) {
      throw new Error('argument error: invalid task');
    }

    let index = this._taskProvider.tasks.indexOf(task);
    if (index < 0) {
      throw new Error('error: task not found');
    }

    return (this._taskProvider.tasks[index] = task);
  }
}
