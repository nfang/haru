import {Injectable, provide} from '@angular/core';
import {Task} from '../task.model';
import {TaskService} from './interfaces';

@Injectable()
export class InMemoryTaskProvider {
  public tasks: Task[];

  constructor() {
    this.tasks = [
      new Task('Read documentation'),
      new Task('Write demo todo app')
    ];

    this.tasks[0].checklist = [
      new Task('Read section 1'),
      new Task('Read section 2')
    ];
  }
}

@Injectable()
export class InMemoryTaskService implements TaskService {
  constructor(
    private _taskProvider: InMemoryTaskProvider
  ) { }

  list(): Task[] {
    return this._taskProvider.tasks;
  }

  add(task: Task): number {
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

    return Object.assign(this._taskProvider.tasks[index], task);
  }
}
