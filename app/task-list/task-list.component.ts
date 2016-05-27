import {
  Component,
  Inject,
  Input
} from '@angular/core';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';

import { Task } from '../shared/task.model';
import { TaskComponent } from '../task/task.component';
import {
  TaskFinderComponent,
  ValueChangeEvent
} from '../task-finder/task-finder.component';
import { TaskService, TASK_SERVICE_TOKEN } from '../shared/services';
import {
  SortOrder,
  SortSpec,
  FilterSpec,
  QueryCommand
} from '../shared/utils/query-command';

@Component({
  selector: 'task-list',
  template: require('./task-list.component.html'),
  styles: [
    require('./task-list.component.scss')
  ],
  directives: [
    MD_LIST_DIRECTIVES, TaskComponent, TaskFinderComponent
  ]
})
export class TaskListComponent {
  private queryCommand: QueryCommand;

  constructor(
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskService
  ) {
    this.queryCommand = new QueryCommand();
    this.queryCommand.sortBy =
      new SortSpec(['isPrioritised', 'createdDate', 'title'], [SortOrder.DESC]);
  }

  updateQuery(event: ValueChangeEvent) {
    if (!event.value) {
      return;
    }
    this.queryCommand.filter = new FilterSpec((task) => {
      return task.title.toLowerCase().includes(event.value.title);
    });
  }

  get tasks() {
    let tasks = this.taskService.list();
    return this.queryCommand.execute(tasks);
  }
}
