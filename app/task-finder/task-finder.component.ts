import {
  Component,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import { Control } from '@angular/common';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounce';

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
  ]
})
export class TaskFinderComponent {
  private _changeEmitter: EventEmitter<ValueChangeEvent> = new EventEmitter<ValueChangeEvent>();

  @Output('change')
  get onChange(): Observable<ValueChangeEvent> {
    return this._changeEmitter.asObservable();
  }

  query: Control;

  constructor(
    @Inject(TASK_SERVICE_TOKEN) private _taskService: TaskService
  ) {
    this.query = new Control('');
    this.query.valueChanges
      .debounce((value) => {
        return value && value.trim().length ?
          Observable.timer(400) : Observable.timer(0);
      })
      .subscribe(query => {
        let task = new Task(this.query.value.trim());
        this._changeEmitter.emit(new ValueChangeEvent(task))
      });
  }

  submit(event) {
    if (this.query.value && this.query.value.trim().length) {
      let task = new Task(this.query.value);
      this._taskService.add(task);
      this.query.updateValue('');
    }
    event.preventDefault();
  }
}
