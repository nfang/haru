import { AbstractControl } from '@angular/common';
import { Task } from '../shared/task.model';
import { ValidatorFn } from '@angular/common/src/forms/directives/validators';

export class TaskValidators {

  static validateTitle(tasks: Task[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let target = new Task(control.value);
      if (tasks.filter(t => t.equals(target)).length) {
        return { 'taskTitleTaken': true };
      }
      return null;
    }
  }
}
