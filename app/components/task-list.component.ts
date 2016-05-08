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
    this.queryCommand.orderIteratees = ['isPrioritised','createdDate','title'];
    this.queryCommand.orders = ['desc'];
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

class QueryCommand {
  constructor() {
    this.query = (item) => item;
    this.orderIteratees = []; 
    this.orders = [];
  }
  query: Function;
  orders: string[];
  orderIteratees: string[];

  execute(targets){
    let subset = targets;
    if (this.query) {
      subset = subset.filter(this.query);                
      }    
    if(typeof this.orderIteratees !== 'undefined' && this.orderIteratees.length > 0) {
      subset = _.orderBy(subset,this.orderIteratees,this.orders);
    }
    return subset;
  }
}
