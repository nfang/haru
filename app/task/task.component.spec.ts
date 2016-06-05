import {
  async,
  it,
  inject,
  injectAsync,
  describe,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import { Component, ElementRef } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { By } from '@angular/platform-browser';

import { Task } from '../shared/task.model';
import { TaskComponent } from './task.component';
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

describe('A TaskComponent', () => {
  let builder, taskService;
  let mockDOMEvent = {
    stopPropagation: () => { },
    preventDefault: () => { },
  }

  beforeEachProviders(() => [
    IN_MEMORY_TASK_SERVICE_PROVIDERS,
    {
      provide: InMemoryTaskProvider,
      useClass: MockInMemoryTaskProvider
    },
    {
      provide: ElementRef,
      useValue: { nativeElement: {} }
    },
    HTTP_PROVIDERS
  ]);

  beforeEach(inject([TestComponentBuilder, TASK_SERVICE_TOKEN], (tcb, service) => {
    builder = tcb;
    taskService = service;
  }));

  it('can be used as a directive', async(() => {
    builder.createAsync(TaskComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(TaskComponent));

        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));

  it('shows task title', async(() => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          task = taskService.list()[0];
        component.task = task;
        fixture.detectChanges();
        expect(element.querySelector('.title').textContent).toBe(task.title);
      });
  }));

  it('marks a task complete', async(() => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          task: Task = taskService.list()[0],
          buttonComplete = element.querySelector('.btn-mark-complete');
        component.task = task;
        fixture.detectChanges();

        expect(element.classList.length).toBe(0);
        expect(buttonComplete.querySelector('md-icon').textContent)
          .toBe('radio_button_unchecked');

        buttonComplete.click();
        fixture.detectChanges();

        expect(element.classList.contains('completing')).toBe(true);
        expect(buttonComplete.querySelector('md-icon').innerText)
          .toBe('lens');
      })
  }));

  it('removes priority when a task is marked complete', async(() => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          task = taskService.list()[0],
          buttonComplete = fixture.nativeElement.querySelector('.btn-mark-complete'),
          buttonPrioritise = fixture.nativeElement.querySelector('.btn-prioritise');
        task.isPrioritised = true;
        component.task = task;
        fixture.detectChanges();

        expect(buttonPrioritise.classList).toContain('marked');

        buttonComplete.click();
        fixture.detectChanges();

        expect(component.task.isPrioritised).toBe(false);
        expect(buttonPrioritise.classList).not.toContain('marked');
      });
  }));

  it('removes a task', async(() => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          buttonDelete = element.querySelector('.btn-delete'),
          task = taskService.list()[0];
        component.task = task;
        fixture.detectChanges();

        expect(component.task).not.toBeNull();

        buttonDelete.click();
        fixture.detectChanges();

        expect(taskService.list().length).toBe(1);
      });
  }));

  it('prioritises a task', async(() => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          buttonPrioritise = element.querySelector('.btn-prioritise'),
          buttonComplete = element.querySelector('.btn-mark-complete'),
          task = taskService.list()[1];
        component.task = task;
        fixture.detectChanges();

        expect(buttonPrioritise.classList.contains('marked')).toBe(false);
        expect(buttonPrioritise.classList.contains('disabled')).toBe(false);

        buttonPrioritise.click();
        fixture.detectChanges();

        expect(task.isPrioritised).toBeTruthy();
        expect(buttonPrioritise.classList.contains('marked')).toBe(true);

        buttonComplete.click();
        fixture.detectChanges();

        expect(buttonPrioritise.classList.contains('disabled')).toBe(true);
      });
  }));

  it('shows task details when expanded', async(() => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          header = element.querySelector('header');
        component.task = taskService.list()[0];
        fixture.detectChanges();

        expect(element.classList.contains('expanded')).toBe(false);

        header.click();
        fixture.detectChanges();

        expect(element.classList.contains('expanded')).toBe(true);
      });
  }));

  it('can add subtasks', async(() => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          task = taskService.list()[0];
        component.task = task;
        fixture.detectChanges();

        expect(element.querySelectorAll('.checklist md-list-item').length).toBe(0);

        component.task.addSubtask(new Task('subtask'));
        fixture.detectChanges();

        expect(element.querySelectorAll('.checklist md-list-item').length).toBe(1);
        expect(element.querySelector('.checklist md-list-item .checkbox-label').textContent)
          .toMatch(/subtask/);
      });
  }));

  it('can remove subtasks', async(() => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          task = taskService.list()[0],
          subtask = new Task('subtask');
        task.addSubtask(subtask);
        component.task = task;
        fixture.detectChanges();

        expect(element.querySelectorAll('.checklist md-list-item').length).toBe(1);

        component.task.removeSubtask(subtask);
        fixture.detectChanges();

        expect(element.querySelectorAll('.checklist md-list-item').length).toBe(0);
      });
  }));

  it('saves task notes', async(() => {
    builder.createAsync(TaskComponent)
      .then((fixture: ComponentFixture<any>) => {
        let component = fixture.componentInstance,
          element = fixture.nativeElement,
          task: Task = taskService.list()[0],
          elNotes = element.querySelector('.textfield-notes > textarea');
        component.task = task;
        fixture.detectChanges();

        expect(elNotes.value).toBe('Note1');

        elNotes.value = 'Note updated';
        elNotes.blur();
        fixture.detectChanges();

        expect(elNotes.value).toBe('Note updated');
      });
  }));
});

@Component({
  selector: 'test',
  template: `<task></task>`,
  directives: [TaskComponent]
})
class TaskComponentTestController { }
