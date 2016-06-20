import { Inject, Component } from '@angular/core';
import { MdCard } from '@angular2-material/card';

import { TaskListComponent } from './task-list/task-list.component';
import { WeatherComponent } from './weather/weather.component';
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
    MdCard, TaskListComponent, WeatherComponent
  ]
})
export class AppComponent {
  private _latestUndoableAction: string;

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
    let hs = this._historyService;
    if (!hs.isEmpty) {
      this._latestUndoableAction = hs.last.actionName;
    }
    return !hs.isEmpty;
  }

  get latestAction(): string {
    return this._latestUndoableAction;
  }
}
