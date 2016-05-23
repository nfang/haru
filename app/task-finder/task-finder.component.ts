import { Component, Output, EventEmitter } from '@angular/core';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { Observable } from 'rxjs/Observable';

import { Task } from '../shared/task.model';
import { TaskService } from '../shared/task.service';
import { TaskProvider } from '../shared/mock-tasks';

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

  constructor(private _taskService: TaskService) {
    this.task = new Task('');
  }

  emitChange(event) {
    this._changeEmitter.emit(new ValueChangeEvent(this.task));
  }

  submit() {
    if (!this.task.title) {
      return;
    }
    this.task.dueDate = new Date();
    this._taskService.add(this.task);
    this.task = new Task('');
  }
}
