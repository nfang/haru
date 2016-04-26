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

  /**
   * Remove the specified task
   * @param  {Task}   task The task to remove
   * @return {Task[]}      An array containing the removed tasks
   */
  remove(task: Task): Task[] {
    if (!task) {
      throw new Error('argument error: invalid task');
    }

    let index = this._taskProvider.tasks.indexOf(task);
    if (index < 0) {
      throw new Error('error: task not found');
    }
    
    return this._taskProvider.tasks.splice(index, 1);
  }

  /**
   * Update an existing task
   * @param  {Task}   task The task to update
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
