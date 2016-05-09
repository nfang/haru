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
    this.queryCommand.sortBy =
      new SortSpec(['isPrioritised', 'createdDate', 'title'], [SortOrder.DESC]);
  }

  ngOnInit() {
    console.log('Task list initiated');
  }

  updateQuery(args) {
    if (!args.value) {
      return;
    }

    this.queryCommand.filter = new FilterSpec((task) => {
      return task.title.toLowerCase().includes(args.value.title);
    });
  }

  get tasks() {
    let tasks = this.taskService.list();
    return this.queryCommand.execute(tasks);
  }
}

enum SortOrder {
  ASC,
  DESC
}

class SortSpec {
  iteratees: string[];
  orders: SortOrder[];

  constructor(iteratees = [], orders = [SortOrder.ASC]) {
    this.iteratees = iteratees;
    this.orders = orders;
  }
}

class FilterSpec {
  predicate: (item: any) => boolean;

  constructor(predicate = (item) => true) {
    this.predicate = predicate;
  }
}

class QueryCommand {
  filter: FilterSpec;
  sortBy: SortSpec;

  execute(targets) {
    let subset = targets;

    if (this.filter) {
      subset = subset.filter(this.filter.predicate);
    }

    if (this.sortBy && this.sortBy.iteratees && this.sortBy.iteratees.length) {
      subset = _.orderBy(subset, this.sortBy.iteratees, this.sortBy.orders);
    }

    return subset;
  }
}
