import {Injectable, provide} from '@angular/core';
import {Task} from '../task.model';
import {ITaskService} from './interfaces';
import {
  InMemoryTaskProvider,
  InMemoryTaskService
} from './in_memory_task_service';
import {
  LocalStorageTaskService
} from './local_storage_task_service';

export {
  InMemoryTaskService,
  InMemoryTaskProvider
} from './in_memory_task_service';

export {LocalStorageTaskService} from './local_storage_task_service';

@Injectable()
export class TaskService implements ITaskService {
  list(): Task[] { return []; }
  add(task: Task): number { return 0; }
  remove(task: Task): Task[] { return []; }
  update(task: Task): Task { return null; }
}

export const IN_MEMORY_TASK_SERVICE_PROVIDERS: any[] = [
  provide(TaskService, { useClass: InMemoryTaskService }),
  InMemoryTaskProvider
];

export const LOCAL_STORAGE_TASK_SERVICE_PROVIDERS: any[] = [
  provide(TaskService, { useClass: LocalStorageTaskService })
];
