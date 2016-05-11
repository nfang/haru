import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import { Task } from '../models/task';
import { SortOrder, SortSpec, FilterSpec, QueryCommand } from './query-command';

describe('QueryCommand', () => {

  let tasks: Task[];

  beforeEach(() => {
    tasks = [
      new Task('Task 1', 'Note 1', new Date(2016, 5, 14)),
      new Task('Task 2', 'Note 2', new Date(2016, 5, 30)),
      new Task('Task 1', 'Note 3', new Date(2016, 6, 30)),
    ];
  });

  it('can initalise SortSpec', () => {
    const sortSpec = new SortSpec(['isPrioritised', 'createdDate', 'title'], [SortOrder.DESC]);
    expect(sortSpec.iteratees).toEqual(jasmine.arrayContaining(['isPrioritised', 'createdDate', 'title']));
    expect(sortSpec.orders).toEqual(jasmine.arrayContaining(['desc']));
    expect(sortSpec.orders).not.toEqual(jasmine.arrayContaining(['asc']));
  });

  it('should return default value [] for sortSpec.iteratees and [asc] for sortSpec.orders', () => {
    const sortSpec = new SortSpec();
    expect(sortSpec.iteratees).not.toBeNull;
    expect(sortSpec.iteratees.length).toBe(0);
    expect(sortSpec.orders).not.toBeNull;
    expect(sortSpec.orders.length).toBe(1);
    expect(sortSpec.orders).toEqual(jasmine.arrayContaining(['asc']));
  });
  
  it('should return ture for filterSpec.predicate', () => {
    const filterSpec = new FilterSpec();
    expect(filterSpec.predicate).toBeTruthy;
  });

  it('should return an filtered array when filterSpec is matching the search criteria', () => {
    const filterSpec = new FilterSpec((task) => {
      return task.title.toLowerCase().includes('Task 1');
    });
    const result = tasks.filter(filterSpec.predicate);
    expect(result.length).toEqual(1);
    expect(result[0].title).toEqual('Task 1');
  });

  it('should return empty array when no result is found', () => {
    const filterSpec = new FilterSpec((task) => {
      return task.title.toLowerCase().includes('test 1');
    });
    const result = tasks.filter(filterSpec.predicate);
    expect(result.length).toEqual(0);
  });

  it('should return an ordered and filtered collection based on sortSpec and filterSpec', () => {
    tasks[2].isPrioritised = true;
    const sortSpec = new SortSpec(['isPrioritised', 'createdDate', 'title'], [SortOrder.DESC]);
    const filterSpec = new FilterSpec((task) => {
      return task.title.toLowerCase().includes('Task 1');
    });
    let queryCommand = new QueryCommand();
    queryCommand.sortBy = sortSpec;
    queryCommand.filter = filterSpec;
    const result = queryCommand.execute(tasks);
    expect(result.length).toEqual(2);
    expect(result[0].title).toEqual('Task 1');
    expect(result[1].title).toEqual('Task 1');
    expect(result[0].notes).toEqual('Note 3');
  });

  it('should return original collection', () => {
    const queryCommand = new QueryCommand();
    const result = queryCommand.execute(tasks);
    expect(result).toEqual(tasks);
  });

  it('should return an ordered collection based on sortSpec when filterSpec is null', () => {
    tasks[2].isPrioritised = true;
    const sortSpec = new SortSpec(['isPrioritised', 'createdDate', 'title'], [SortOrder.DESC]);
    let queryCommand = new QueryCommand();
    queryCommand.sortBy = sortSpec;
    queryCommand.filter = null;
    const result = queryCommand.execute(tasks);
    expect(result.length).toEqual(3);
    expect(result[0].title).toEqual('Task 1');
    expect(result[1].title).toEqual('Task 1');
    expect(result[0].notes).toEqual('Note 3');
  });
});
