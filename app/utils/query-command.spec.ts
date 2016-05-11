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
    expect(sortSpec.iteratees).not.toEqual(jasmine.arrayContaining(['dueDate']));
    expect(sortSpec.orders).toEqual(jasmine.arrayContaining(['desc']));
    expect(sortSpec.orders).not.toEqual(jasmine.arrayContaining(['asc']));
  });

  it('can initalise SortSpec with empty constructor', () => {
    const sortSpec = new SortSpec();
    expect(sortSpec.iteratees).not.toBeNull;
    expect(sortSpec.iteratees.length).toBe(0);
    expect(sortSpec.orders).not.toBeNull;
    expect(sortSpec.orders.length).toBe(1);
    expect(sortSpec.orders).toEqual(jasmine.arrayContaining(['asc']));
  });

  it('can filter based on filter spec', () => {
    const filterSpec = new FilterSpec((task) => {
      return task.title.toLowerCase().includes('Task 1');
    });
    const result = tasks.filter(filterSpec.predicate);
    expect(result.length).toEqual(1);
    expect(result[0].title).toEqual('Task 1');
  });

  it('can filter with incorrect value', () => {
    const filterSpec = new FilterSpec((task) => {
      return task.title.toLowerCase().includes('test 1');
    });
    const result = tasks.filter(filterSpec.predicate);
    expect(result.length).toEqual(0);
  });

  it('execute with filter and order based on filter and sort spec', () => {
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

  it('execute with empty queryCommand constructor', () => {
    const queryCommand = new QueryCommand();
    const result = queryCommand.execute(tasks);
    expect(result).toEqual(tasks);
  });

  it('execute with no filter and order based on sort spec', () => {
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
