import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';

import { HistoryService, Momento } from './history.service';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEachProviders(() => [
    HistoryService
  ]);

  it('initiates with default parameters', inject([HistoryService], (service) => {
    expect(service.expiry).toBe(7000);
    expect(service.capacity).toBe(1);
    expect(service.isEmpty).toBe(true);
  }));

  it('allows appending momentos', inject([HistoryService], (service) => {
    let momento = new Momento('', () => {});
    service.registerRemoval(momento);
    expect(service.isEmpty).toBe(false);
  }));

  it('removes oldest momento when the pool is full', inject([HistoryService], (service) => {
    service.capacity = 1;
    let momento1 = new Momento('1', () => {});
    let momento2 = new Momento('2', () => {});
    service.registerRemoval(momento1);
    service.registerRemoval(momento2);
    expect(service.size).toBe(1);
  }));

  it('restores momentoes', inject([HistoryService], (service) => {
    service.capacity = 3;
    let momentoes = [
      new Momento('', () => {}),
      new Momento('', () => {}),
      new Momento('', () => {})
    ];
    momentoes.forEach(item => {
      spyOn(item, 'rollback');
      service.registerRemoval(item.rollback);
    });
    service.restore(3);
    momentoes.forEach(item => {
      expect(item.rollback).toHaveBeenCalled();
    });
  }));
});
