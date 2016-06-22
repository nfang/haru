import { provide } from '@angular/core';
import {
  disableDeprecatedForms,
  provideForms
} from '@angular/forms';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app.component';
import {
  IN_MEMORY_TASK_SERVICE_PROVIDERS,
  LOCAL_STORAGE_TASK_SERVICE_PROVIDERS,
  HistoryService
} from './shared/services';

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  HTTP_PROVIDERS,
  LOCAL_STORAGE_TASK_SERVICE_PROVIDERS,
  HistoryService
]);
