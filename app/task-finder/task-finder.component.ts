import {
  Component,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { Observable } from 'rxjs/Observable';

import { Task } from '../shared/task.model';
import { TaskService, TASK_SERVICE_TOKEN } from '../shared/services';

export class ValueChangeEvent {
  constructor(public value) {}
}

@Component({
  selector: 'task-finder',
  template: require('./task-finder.component.html'),
  styles: [
    require('./task-finder.component.scss')
  ],
  directives: [ MD_INPUT_DIRECTIVES ]
})
export class TaskFinderComponent {
  private _changeEmitter: EventEmitter<ValueChangeEvent> = new EventEmitter<ValueChangeEvent>();

  @Output('change')
  get onChange(): Observable<ValueChangeEvent> {
    return this._changeEmitter.asObservable();
  }

  task: Task;

  constructor(
    @Inject(TASK_SERVICE_TOKEN) private _taskService: TaskService
  ) {
    this.task = new Task('');
  }

  emitChange(event) {
    this._changeEmitter.emit(new ValueChangeEvent(this.task));
  }

  submit() {
    if (!this.task.title) {
      return;
    }
    this._taskService.add(this.task);
    this.task = new Task('');
  }
}
