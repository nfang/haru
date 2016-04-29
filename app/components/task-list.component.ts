import { Component, Input } from 'angular2/core';

import { Task }             from '../models/task';
import { TaskComponent }    from './task.component';
import { TaskService }      from '../services/task.service';

const _ = require('lodash');

@Component({
  selector: 'task-list',
  template: require('./task-list.component.html'),
  styles: [
    require('./task-list.component.scss')
  ],
  directives: [
    TaskComponent
  ],
  providers: [
    TaskService
  ]
})
export class TaskListComponent {
  @Input() query: string;

  constructor(private _taskService: TaskService) { }

  ngOnInit() {
    console.log('Task list initiated');
  }

  get tasks(): Task[] {
    let originTasks = this._taskService.list();
    let tasks = _.orderBy(originTasks,['isPrioritised','createdDate','title'],['asc']);
    return tasks.filter(task => {
      return task.title.toLowerCase().includes(this.query);
    });
  }
}
