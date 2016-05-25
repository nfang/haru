import { Task } from './task.model';

describe('Task', () => {
  let task;

  beforeEach(() => {
    task = new Task('');
  });

  it('should initialise with default values', () => {
    expect(task.title).toBe('');
    expect(task.isCompleted).toBe(false);
    expect(task.isPrioritised).toBe(false);
    expect(task.notes).toBe('');
    expect(task.createAt).not.toBeNull();
    expect(task.checklist).not.toBeNull();
  });

  it('can add subtasks', () => {
    expect(task.checklist.length).toBe(0);

    task.addSubtask(new Task('test 0'));
    expect(task.checklist.length).toBe(1);
    expect(task.checklist[0].title).toBe('test 0');

    // Subtask with same title won't be added
    task.addSubtask(new Task('test 0'));
    expect(task.checklist.length).toBe(1);
  });

  it('can remove subtasks', () => {
    let subtask = new Task('test');
    task.addSubtask(subtask);
    expect(task.checklist.length).toBe(1);

    let removed = task.removeSubtask(subtask);
    expect(task.checklist.length).toBe(0);
    expect(removed.length).toBe(1);
    expect(removed[0].title).toBe('test');
  });

});
