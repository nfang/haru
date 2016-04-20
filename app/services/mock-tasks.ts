import { Injectable } from 'angular2/core';
import { Task } from '../models/task';

@Injectable()
export class TaskProvider {
  public tasks: Task[] = [
    { title: 'Read documentation', notes: '', dueDate: new Date(2016, 5, 14) },
    { title: 'Write demo todo app', notes: '', dueDate: new Date(2016, 5, 30) }
  ];
}
