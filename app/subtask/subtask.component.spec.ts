import {
  it,
  inject,
  injectAsync,
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
import { SubtaskComponent } from '../subtask/subtask.component';

describe('SubtaskComponent', () => {
  let builder, task;
  let mockEvent = {
    stopPropagation: () => {},
    preventDefault: () => {},
  }

  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    MdCheckbox,
    SubtaskComponent,
    TestComponentBuilder
  ]);

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
    task = new Task('Subtask');
  }));

  it('should inject the component', inject([SubtaskComponent],
    (component: SubtaskComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(SubtaskComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(SubtaskComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));

  it('renders a task', done => {
    builder.createAsync(SubtaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement;
        component.task = task;
        fixture.detectChanges();
        expect(element.querySelector('.checkbox-label').innerText).toBe(task.title);
        done();
      })
      .catch(e => done.fail(e));
  })

  it('can mark a task complete', done => {
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
        done();
      })
      .catch(e => done.fail(e));
  });
});

@Component({
  selector: 'test',
  template: `<subtask></subtask>`,
  directives: [SubtaskComponent]
})
class SubtaskComponentTestController { }
