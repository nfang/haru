import { Component, Input } from 'angular2/core';

import { Task } from '../models/task';
import { TaskComponent } from './task.component';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'task-list',
  template: require('./task-list.component.html'),
  directives: [
    TaskComponent
  ],
  providers: [
    TaskService
  ]
})
export class TaskListComponent {
  @Input() query: string;

  constructor(
    private _taskService: TaskService
  ) { }

  ngOnInit() {
    console.log('Task list initiated');
  }

  get tasks() {
    var tasks = this._taskService.list();
    return tasks.filter(task => {
      return task.title.toLowerCase().includes(this.query);
    });
  }
}
