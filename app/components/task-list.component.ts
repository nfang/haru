import { Component, Input } from 'angular2/core';

import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'task-list',
  template: require('./task-list.component.html'),
  providers: [
    TaskService
  ]
})
export class TaskListComponent {
  @Input()
  set query(query: string) {
    let tasks = this._taskService.list();
    this._tasks = tasks.filter((task) => {
      return task.title.toLowerCase().includes(query);
    });
  }

  _tasks: Task[];

  constructor(
    private _taskService: TaskService
  ) { }

  ngOnInit() {
    this._tasks = this._taskService.list();
    console.log('Task list initiated');
  }

  get tasks() { return this._tasks; }
}
