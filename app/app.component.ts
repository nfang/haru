import { Inject, Component } from '@angular/core';
import { MdCard } from '@angular2-material/card';

import { TaskListComponent } from './task-list/task-list.component';
import {
  HistoryService,
  TaskService,
  TASK_SERVICE_TOKEN
} from './shared/services';

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
    @Inject(TASK_SERVICE_TOKEN) private _taskService: TaskService,
    private _historyService: HistoryService
  ) {
    this.today = new Date();
  }

  undo() {
    this._historyService.restore();
  }

  get progress(): string {
    let tasks = this._taskService.list();
    let total = tasks.length;
    let completed = tasks.filter((task) => {
      return task.isCompleted;
    }).length;
    return `${completed} / ${total}`;
  }

  get hasUndoItems(): boolean {
    return !this._historyService.isEmpty;
  }
}
