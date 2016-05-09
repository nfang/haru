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
    this.queryCommand.orderBy = new SortSpec(['isPrioritised','createdDate','title'], [SORTORDER[1]]);
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
    return this.queryCommand.execute(tasks);
  }
}

enum SORTORDER {
  'asc',
  'desc'
}

class SortSpec {
  iteratees: string[];
  orders: string[];
  constructor(orderIteratees, orders = [SORTORDER[0]]){
    this.iteratees = orderIteratees;
    this.orders = orders;
  }  
}

class QueryCommand {
  constructor() {
    this.query = (item) => item;
    this.orderBy = new SortSpec([]);
  }
  query: Function;
  orderBy: SortSpec;

  execute(targets){
    let subset = targets;
    if (this.query) {
      subset = subset.filter(this.query);          
      }
    if (this.orderBy && this.orderBy.iteratees && this.orderBy.iteratees.length) {
      subset = _.orderBy(subset,this.orderBy.iteratees,this.orderBy.orders);
    }
    return subset;
  }
}
