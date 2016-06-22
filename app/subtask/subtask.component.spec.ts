import {
  async,
  it,
  xit,
  inject,
  describe,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { By } from '@angular/platform-browser';
import { MdCheckbox } from '@angular2-material/checkbox';

import { Task } from '../shared/task.model';
import { SubtaskComponent } from './subtask.component';

describe('A SubtaskComponent', () => {
  let builder, task;

  beforeEachProviders(() => [
    HTTP_PROVIDERS
  ]);

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
    task = new Task('Subtask');
  }));

  it('can be used as a directive', async(() => {
    builder.createAsync(SubtaskComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(SubtaskComponent));

        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));

  xit('shows subtask title', async(() => {
    builder.createAsync(SubtaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement;
        component.task = task;
        fixture.detectChanges();

        expect(element.querySelector('.checkbox-label').textContent).toBe(task.title);
      });
  }));

  xit('marks a subtask complete', async(() => {
    builder.createAsync(SubtaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.debugElement;
        component.task = task;
        fixture.detectChanges();
        let checkbox = fixture.debugElement.query(By.directive(MdCheckbox));

        expect(checkbox.componentInstance.checked).toBe(false);

        task.isCompleted = true;
        fixture.detectChanges();

        expect(checkbox.componentInstance.checked).toBe(true);
      });
  }));

  xit('removes a subtask', async(() => {
    builder.createAsync(SubtaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          buttonDelete = element.querySelector('.btn-delete-subtask');
        component.task = task;
        fixture.detectChanges();
        component.onChange.subscribe(removedTask =>
          expect(removedTask).toBe(task)
        );
        buttonDelete.click();
      });
  }));
});

@Component({
  selector: 'test',
  template: `<subtask></subtask>`,
  directives: [SubtaskComponent]
})
class SubtaskComponentTestController { }
