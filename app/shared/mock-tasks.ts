import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable()
export class TaskProvider {
  public tasks: Task[] = [
    new Task('Read documentation', '', new Date(2016, 5, 14)),
    new Task('Write demo todo app', '', new Date(2016, 5, 30))
  ];
}
