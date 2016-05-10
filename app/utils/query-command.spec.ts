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
    let sortSpec: SortSpec;
    let tasks: Task[];
    let filterSpec: FilterSpec;
    let queryCommand: QueryCommand;
    
    beforeEach(() => {
        tasks = [
            new Task('Task 1', 'Note 1', new Date(2016, 5, 14)),
            new Task('Task 2', 'Note 2', new Date(2016, 5, 30)),
            new Task('Task 1', 'Note 3', new Date(2016, 6, 30)),
        ];
        
        tasks[2].isPrioritised = true;
        
        sortSpec = new SortSpec(['isPrioritised', 'createdDate', 'title'], [SortOrder.DESC]);
        
        filterSpec = new FilterSpec((task) => {
            return task.title.toLowerCase().includes('Task 1');
        });

        queryCommand = new QueryCommand();
        
        queryCommand.sortBy = sortSpec;
        queryCommand.filter = filterSpec;
    });
    
    it('can inital SortSpec', () => {
        expect(sortSpec.iteratees).toEqual(jasmine.arrayContaining(['isPrioritised', 'createdDate', 'title']));
        expect(sortSpec.iteratees).not.toEqual(jasmine.arrayContaining(['dueDate']));
        expect(sortSpec.orders).toEqual(jasmine.arrayContaining(['desc']));
        expect(sortSpec.orders).not.toEqual(jasmine.arrayContaining(['asc']));
    });
    
    it('can filter based on filterSpec predicate', () => {
        tasks.filter(filterSpec.predicate);        
        expect(tasks.length).toEqual(1);
        expect(tasks[0].title).toEqual('Task 1');
    });
    
    it('execute will filter and order based on filterSpec predicate and sortSpec', () => {
       queryCommand.execute(tasks);
       expect(tasks.length).toEqual(2);
       expect(tasks[0].title).toEqual('Task 1');
       expect(tasks[1].title).toEqual('Task 1');
       expect(tasks[0].notes).toEqual('Note 3');
    });
});