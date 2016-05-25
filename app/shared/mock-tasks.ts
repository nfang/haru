import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable()
export class TaskProvider {
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
