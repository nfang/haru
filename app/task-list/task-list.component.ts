import { Component, Input } from '@angular/core';
import { MdList } from '@angular2-material/list';

import { Task }             from '../shared/task.model';
import { TaskComponent }    from '../task/task.component';
import { TaskFinderComponent } from '../task-finder/task-finder.component';
import { TaskService }      from '../shared/task.service';

import { SortOrder, SortSpec, FilterSpec, QueryCommand } from '../shared/utils/query-command';

@Component({
  selector: 'task-list',
  template: require('./task-list.component.html'),
  styles: [
    require('./task-list.component.scss')
  ],
  directives: [
    MdList, TaskComponent, TaskFinderComponent
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
