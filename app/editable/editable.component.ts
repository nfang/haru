import {
  forwardRef,
  Component,
  ElementRef,
  ViewChild,
  Renderer,
  Input,
  AfterViewInit,
  Provider
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';

const noop = () => {};

const EDITABLE_CONTROL_VALUE_ACCESSOR = new Provider(NG_VALUE_ACCESSOR, {
  useExisting: forwardRef(() => EditableComponent),
  multi: true
});

@Component({
  selector: 'editable',
  styles: [
    require('./editable.component.scss')
  ],
  template: require('./editable.component.html'),
  directives: [MdIcon],
  providers: [
    EDITABLE_CONTROL_VALUE_ACCESSOR,
    MdIconRegistry
  ],
  host: {
    '[class.editing]': '_isEditing'
  }
})
export class EditableComponent implements ControlValueAccessor, AfterViewInit {
  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (v: any) => void = noop;

  private _isEditing: boolean = false;
  private _value: string;

  @Input() enabled: boolean;

  get value(): string { return this._value; }

  @Input() set value(arg: string) {
    if (arg !== this._value) {
      this._value = arg;
      this._onChangeCallback(arg);
    }
  }

  @ViewChild('label') label: ElementRef;
  @ViewChild('input') input: ElementRef;

  constructor(private _renderer: Renderer) { }

  writeValue(value: any) {
    this._value = value;
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  ngAfterViewInit() {
    this._renderer.listen(this.label.nativeElement, 'click', ((event) => {
      this.startEditing(event);
    }).bind(this));
  }

  startEditing(event) {
    if (this.enabled) {
      this._isEditing = true;
      event.stopPropagation();
      setTimeout(() => {
        this.input.nativeElement.focus();
      }, 0);
    }
  }

  endEditing(event) {
    this._isEditing = false;
    event.stopPropagation();
    event.preventDefault();
  }
}
