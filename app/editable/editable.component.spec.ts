import {
  async,
  it,
  xit,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  disableDeprecatedForms,
  provideForms
} from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { By } from '@angular/platform-browser';

import { EditableComponent } from './editable.component';

describe('A EditableComponent', () => {
  let builder;

  beforeEachProviders(() => [
    disableDeprecatedForms(),
    provideForms(),
    HTTP_PROVIDERS
  ]);

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));

  it('creates a native form and input element', async(() => {
    builder.createAsync(EditableComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        expect(fixture.debugElement.query(By.css('form'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input'))).toBeTruthy();
      });
  }));

  it('wraps the content element', async(() => {
    builder.createAsync(EditableComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let labelEl = fixture.debugElement.query(By.css('.editable-label'));
        expect(labelEl.nativeElement.querySelector('span')).toBeTruthy();
      });
  }));

  xit('supports ngModel', async(() => {
    builder.createAsync(EditableComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let instance = fixture.componentInstance;
        let component = fixture.debugElement.query(By.directive(EditableComponent));
        let inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
        instance.label = 'label';
        fixture.detectChanges();

        expect(component.componentInstance.value).toBe('label');
        expect(inputEl.value).toBe('label');

        component.componentInstance.value = 'update';
        fixture.detectChanges();

        expect(inputEl.value).toBe('update');
      });
  }));

  it('hides original element when in edit mode', async(() => {
    builder.createAsync(EditableComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.debugElement.query(By.directive(EditableComponent));
        component.componentInstance.enabled = true;
        component.componentInstance.startEditing({ stopPropagation: () => {} });
        fixture.detectChanges();

        expect(component.nativeElement.classList).toContain('editing');
      });
  }));

  it('saves value when edit mode is ended', async(() => {
    builder.createAsync(EditableComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.debugElement.query(By.directive(EditableComponent));
        component.componentInstance.enabled = true;
        component.componentInstance.startEditing({ stopPropagation: () => {} });
        fixture.detectChanges();

        expect(component.nativeElement.classList).toContain('editing');

        component.componentInstance.endEditing({
          preventDefault: () => {},
          stopPropagation: () => {}
        });
        fixture.detectChanges();

        expect(component.nativeElement.classList).not.toContain('editing');
      });
  }));
});

@Component({
  selector: 'test',
  template: `<editable [(ngModel)]="label"><span>{{label}}</span></editable>`,
  directives: [EditableComponent]
})
class EditableComponentTestController {
  label: string;
}
