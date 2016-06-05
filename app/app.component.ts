import { Inject, Component } from '@angular/core';
import { MdCard } from '@angular2-material/card';

import { TaskListComponent } from './task-list/task-list.component';
import { TaskService, TASK_SERVICE_TOKEN } from './shared/services';

@Component({
  selector: 'todo-app',
  template: require('./app.component.html'),
  styles: [
    require('./app.component.scss')
  ],
  directives: [
    MdCard, TaskListComponent
  ]
})
export class AppComponent {
  today: Date;

  constructor(
    @Inject(TASK_SERVICE_TOKEN) private _taskService: TaskService
  ) {
    this.today = new Date();
  }

  get progress(): string {
    let tasks = this._taskService.list();
    let total = tasks.length;
    let completed = tasks.filter((task) => {
      return task.isCompleted;
    }).length;
    return `${completed} / ${total}`;
  }
}
