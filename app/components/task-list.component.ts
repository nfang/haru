import { Component, Input } from 'angular2/core';

import { Task }             from '../models/task';
import { TaskComponent }    from './task.component';
import { TaskFinderComponent } from './task-finder.component';
import { TaskService }      from '../services/task.service';

const _ = require('lodash');

@Component({
  selector: 'task-list',
  template: require('./task-list.component.html'),
  styles: [
    require('./task-list.component.scss')
  ],
  directives: [
    TaskComponent, TaskFinderComponent
  ]
})
export class TaskListComponent {
  private queryCommand: QueryCommand;

  constructor(private taskService: TaskService) {
    this.queryCommand = new QueryCommand();
  }

  ngOnInit() {
    console.log('Task list initiated');
  }

  updateQuery(args) {
    if (!args.value) {
      return;
    }
    this.queryCommand.query = (task) => {
      return task.title.toLowerCase().includes(args.value.title);
    };
  }

  get tasks() {
    let tasks = this.taskService.list();
    let orderedTasks = this.queryCommand.order(tasks);
    return this.queryCommand.execute(orderedTasks);
  }
}

class QueryCommand {
  constructor() {
    this.query = (item) => item;
  }
  query: Function;
  // sort: Function;
  // order: Function;
  order(targets): Task[]{
    let beforeOrder = targets;
     return _.orderBy(beforeOrder,['isPrioritised','createdDate','title'],['desc']);
  }

  execute(targets): Task[] {
    let subset = targets;
    if (this.query) {
      subset = targets.filter(this.query);
    }
    return subset;
  }
}
