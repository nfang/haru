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
    let tasks = this._taskService.list();
    let orderedTasks = _.orderBy(tasks,['isPrioritised','createAt','title'],['asc']);
    return orderedTasks.filter(task => {
      return task.title.toLowerCase().includes(this.query);
    });
  }
}
