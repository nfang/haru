import { Injectable } from 'angular2/core';
import { Task } from '../models/task';

@Injectable()
export class TaskProvider {
  public tasks: Task[] = [
    new Task('Read documentation',new Date(2016, 3, 14), '', new Date(2016, 5, 14)),
    new Task('Write demo todo app',new Date(2016, 2, 14), '', new Date(2016, 5, 30))
  ];
}
