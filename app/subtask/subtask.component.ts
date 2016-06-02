import {
  Component,
  Input,
  Inject,
  Output,
  EventEmitter,
  DoCheck,
  KeyValueDiffers,
  KeyValueDiffer
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';

import { Task } from '../shared/task.model';

@Component({
  selector: 'subtask',
  template: require('./subtask.component.html'),
  styles: [
    require('./subtask.component.scss')
  ],
  directives: [
    MdCheckbox, MdIcon
  ],
  providers: [MdIconRegistry],
  host: {
    '[class.done]': 'task.isCompleted'
  }
})
export class SubtaskComponent implements DoCheck {
  private _changeEmitter: EventEmitter<any> = new EventEmitter<any>();
  private _removeEmitter: EventEmitter<any> = new EventEmitter<any>();
  private _differ: KeyValueDiffer;

  @Input() task: Task;

  @Output('change')
  get onChange(): Observable<any> {
    return this._changeEmitter.asObservable();
  }

  @Output('remove')
  get onRemove(): Observable<any> {
    return this._removeEmitter.asObservable();
  }

  ngDoCheck() {
    let changes = this._differ.diff(this.task);
    if (changes) {
      this._changeEmitter.emit(this.task);
    }
  }

  constructor(
    private _differs: KeyValueDiffers
  ) {
    this._differ = _differs.find({}).create(null);
  }

  remove() {
    this._removeEmitter.emit(this.task);
  }
}
