import {OpaqueToken} from '@angular/core';
import {Task} from '../task.model';
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

export {TaskService} from './interfaces';

export let TASK_SERVICE_TOKEN = new OpaqueToken('task.service');

export const IN_MEMORY_TASK_SERVICE_PROVIDERS: any[] = [{
  provide: TASK_SERVICE_TOKEN,
  useClass: InMemoryTaskService
},
InMemoryTaskProvider];

export const LOCAL_STORAGE_TASK_SERVICE_PROVIDERS: any[] = [{
  provide: TASK_SERVICE_TOKEN,
  useClass: LocalStorageTaskService
}];

export {HistoryService, Momento} from './history.service';
