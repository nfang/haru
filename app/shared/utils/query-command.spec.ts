import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders
} from '@angular/core/testing';

import { Task } from '../task.model';
import { SortOrder, SortSpec, FilterSpec, QueryCommand } from './query-command';

describe('SortSpec', () => {

  it('can initialise with default values', () => {
    const sortSpec = new SortSpec();
    expect(sortSpec.iteratees).toEqual([]);
    expect(sortSpec.orders).toEqual([SortOrder.ASC]);
  });

  it('can initialise with specific values', () => {
    const sortSpec = new SortSpec(['id', 'name'], [SortOrder.DESC]);
    expect(sortSpec.iteratees).toEqual(['id', 'name']);
    expect(sortSpec.orders).toEqual([SortOrder.DESC, SortOrder.DESC]);
  });

});

describe('FilterSpec', () => {

  it('can initialise with default value', () => {
    const filterSpec = new FilterSpec();
    expect(filterSpec.predicate).not.toBeNull();
    expect(filterSpec.predicate('item')).toBe(true);
  });

  it('can initialise with a specific predicate', () => {
    const filterSpec = new FilterSpec((item) => {
      return item.toString() === 'test';
    });
    expect(filterSpec.predicate).not.toBeNull();
    expect(filterSpec.predicate('test')).toBe(true);
    expect(filterSpec.predicate('TEST')).toBe(false);
  });

});

describe('QueryCommand', () => {

  let tasks: Task[];

  beforeEach(() => {
    tasks = [
      new Task('Task 1', 'Note important', new Date(2016, 5, 14)),
      new Task('Task 2', 'Note normal', new Date(2016, 5, 30)),
      new Task('Task 3', 'Note important', new Date(2016, 6, 30))
    ];
    tasks[1].isPrioritised = true;
  });

  it('can initialise with default specs', () => {
    const command = new QueryCommand();
    let results = command.execute(tasks);
    expect(results.length).toEqual(tasks.length);
    expect(results[0].title).toBe('Task 1');
    expect(results[results.length - 1].title).toBe('Task 3');
  });

  it('should return empty array when no result is found', () => {
    const filterSpec = new FilterSpec((task) => {
      return task.title.toLowerCase().includes('test 1');
    });
    const results = tasks.filter(filterSpec.predicate);
    expect(results.length).toEqual(0);
  });

  it('can filter a collection according to a specific criteria', () => {
    const command = new QueryCommand();
    command.filter = new FilterSpec((task) => {
      return task.title.toLowerCase().includes('task 1');
    });
    command.sortBy = null;
    const results = command.execute(tasks);
    expect(results.length).toEqual(1);
    expect(results[0].title).toBe('Task 1');
  });

  it('can sort a collection according to the sort spec', () => {
    const command = new QueryCommand();
    command.filter = null;
    command.sortBy = new SortSpec(['isPrioritised', 'createdDate', 'title'], [SortOrder.DESC]);
    const results = command.execute(tasks);
    expect(results[0].title).toEqual('Task 2');
    expect(results[1].title).toEqual('Task 3');
    expect(results[2].title).toEqual('Task 1');
  });

  it('can filter and sort a collection according to the specified spec', () => {
    const queryCommand = new QueryCommand();
    queryCommand.sortBy = new SortSpec(['isPrioritised', 'createdDate', 'title'], [SortOrder.DESC]);
    queryCommand.filter = new FilterSpec((task) => {
      return task.notes.toLowerCase().includes('note important');
    });
    const results = queryCommand.execute(tasks);
    expect(results.length).toEqual(2);
    expect(results[0].title).toEqual('Task 3');
    expect(results[1].title).toEqual('Task 1');
  });

  it('should return the original collection when filter and sort spec is not provided', () => {
    const command = new QueryCommand();
    command.filter = null;
    command.sortBy = null;
    const results = command.execute(tasks);
    expect(results).toEqual(tasks);
  });

});
