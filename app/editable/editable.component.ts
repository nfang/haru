import {
  Component,
  ViewChild,
  Input,
  Renderer,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'editable',
  styles: [
    require('./editable.component.scss')
  ],
  template: require('./editable.component.html'),
  host: {
    '[class.editing]': '_isEditing'
  }
})
export class EditableComponent {
  private _submitEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Output('submit')
  get onSubmit(): Observable<any> {
    return this._submitEmitter.asObservable();
  }

  @Input() model: string;
  @Input() enabled: boolean;

  private _isEditing: boolean = false;

  @ViewChild('label') label;

  constructor(private _renderer: Renderer) {}

  ngAfterViewInit() {
    this._renderer.listen(this.label.nativeElement, 'click', ((event) => {
      this.startEditing(event);
    }).bind(this));
  }

  startEditing(event) {
    if (this.enabled) {
      this._isEditing = true;
      event.stopPropagation();
    }
  }

  endEditing(event) {
    this._isEditing = false;
    this._submitEmitter.emit(this.model);
    event.stopPropagation();
  }
}
