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
import { TaskComponent } from '../task/task.component';
import { SubtaskComponent } from '../subtask/subtask.component';
import {
  TASK_SERVICE_TOKEN,
  InMemoryTaskProvider,
  IN_MEMORY_TASK_SERVICE_PROVIDERS
} from '../shared/services';

class MockInMemoryTaskProvider {
  public tasks: Task[] = [
    new Task('Task1', 'Note1'),
    new Task('Task2', 'Note2')
  ];
}

describe('TaskComponent', () => {
  let builder, taskService;
  let mockEvent = {
    stopPropagation: () => {},
    preventDefault: () => {},
  }

  beforeEachProviders(() => [
    IN_MEMORY_TASK_SERVICE_PROVIDERS,
    {
      provide: InMemoryTaskProvider,
      useClass: MockInMemoryTaskProvider
    },
    HTTP_PROVIDERS,
    MdCheckbox,
    SubtaskComponent,
    TaskComponent,
    TestComponentBuilder
  ]);

  beforeEach(inject([TestComponentBuilder, TASK_SERVICE_TOKEN], (tcb, service) => {
    builder = tcb;
    taskService = service;
  }));

  it('should inject the component', inject([TaskComponent],
    (component: TaskComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(TaskComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(TaskComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));

  it('renders a task', done => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement,
            task = taskService.list()[0];
        component.task = task;
        fixture.detectChanges();
        expect(element.querySelector('.title').innerText).toBe(task.title);
        done();
      })
      .catch(e => done.fail(e));
  })

  it('can mark a task complete', done => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement,
            task: Task = taskService.list()[0],
            elBtnComplete = element.querySelector('.btn-mark-complete');

        component.task = task;
        fixture.detectChanges();
        expect(element.classList.length).toBe(0);
        expect(elBtnComplete.querySelectorAll('md-icon').length).toBe(1);
        expect(elBtnComplete.querySelector('md-icon').innerText).toEqual('radio_button_unchecked');

        component.toggleCompleted(mockEvent);
        fixture.detectChanges();
        expect(component.task.isPrioritised).toBe(false);
        expect(element.classList.contains('done')).toBe(true);
        expect(elBtnComplete.querySelectorAll('md-icon').length).toBe(1);
        expect(elBtnComplete.querySelector('md-icon').innerText).toEqual('lens');
        done();
      })
      .catch(e => done.fail(e));
  });

  it('can remove a task', done => {
    builder.createAsync(TaskComponent)
     .then((fixture: ComponentFixture<any>) => {
       let component = fixture.componentInstance,
           element = fixture.nativeElement,
           task = taskService.list()[0];

       component.task = task;
       fixture.detectChanges();
       expect(component.task).not.toBeNull();
       component.remove(mockEvent);

       fixture.detectChanges();
       expect(taskService.list().length).toBe(1);
       done();
     })
     .catch(e => done.fail(e));
  });

  it('can prioritise a task', done => {
    builder.createAsync(TaskComponent)
     .then((fixture: ComponentFixture<any>) => {
       let component = fixture.componentInstance,
           element = fixture.nativeElement,
           task = taskService.list()[1],
           elBtnPrioritise = element.querySelector('.btn-prioritise');

       component.task = task;
       fixture.detectChanges();
       expect(elBtnPrioritise.classList.contains('marked')).toBe(false);
       expect(elBtnPrioritise.classList.contains('disabled')).toBe(false);

       component.togglePrioritised(mockEvent);
       fixture.detectChanges();
       expect(task.isPrioritised).toBeTruthy();
       expect(elBtnPrioritise.classList.contains('marked')).toBe(true);

       component.toggleCompleted(mockEvent);
       fixture.detectChanges();
       expect(elBtnPrioritise.classList.contains('disabled')).toBe(true);
       done();
     })
     .catch(e => done.fail(e));
  });

  it('can toggle a detail pane', done => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement;

        component.task = taskService.list()[0];
        fixture.detectChanges();
        expect(element.classList.contains('expanded')).toBe(false);

        component.toggleDetailPane();
        fixture.detectChanges();
        expect(element.classList.contains('expanded')).toBe(true);
        done();
      })
      .catch(e => done.fail(e));
  });

  it('can add a subtask', done => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement;
        component.task = new Task('');
        fixture.detectChanges();
        expect(element.querySelectorAll('.checklist md-list-item').length).toBe(0);

        // The following is commented out because of:
        // TypeError: Attempting to configurable attribute of unconfigurable property.
        // at webpack:///~/zone.js/dist/zone.js:1035:0
        //
        // component.task.addSubtask(new Task('subtask'));
        // fixture.detectChanges();
        // expect(element.querySelectorAll('.checklist md-list-item').length).toBe(1);
        // expect(element.querySelector('.checklist md-list-item .checkbox-label').textContent.trim())
        //   .toBe('subtask');
        done();
      })
      .catch(e => {
        console.log(e);
        done.fail(e);
      });
  });

  it('can remove a subtask', done => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement,
            task = new Task(''),
            subtask = new Task('subtask');
            
        // The following is commented out because of:
        // TypeError: Attempting to configurable attribute of unconfigurable property.
        // at webpack:///~/zone.js/dist/zone.js:1035:0
        //
        // task.addSubtask(subtask);
        // component.task = task;
        // fixture.detectChanges();
        // expect(element.querySelectorAll('.checklist md-list-item').length).toBe(1);
        //
        // component.task.removeSubtask(subtask);
        // fixture.detectChanges();
        // expect(element.querySelectorAll('.checklist md-list-item').length).toBe(0);
        done();
      })
      .catch(e => done.fail(e));
  });

  it('can add task notes', done => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
            element = fixture.nativeElement,
            task: Task = taskService.list()[0],
            elNotes = element.querySelector('.textfield-notes > textarea');

        component.task = task;
        fixture.detectChanges();
        expect(elNotes.value).toBe('Note1');

        component.task.notes = 'Note Updated';
        component.save();
        fixture.detectChanges();
        expect(elNotes.value).toBe('Note Updated');
        done();
      })
      .catch(e => done.fail(e));
  });
});

@Component({
  selector: 'test',
  template: `<task></task>`,
  directives: [TaskComponent]
})
class TaskComponentTestController { }
