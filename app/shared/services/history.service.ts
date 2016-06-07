import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

export class Momento {
  constructor(
    public actionName: string,
    public rollback: () => void
  ) { }
}

const DEFAULT_CAPACITY = 5;
const DEFAULT_EXPIRY = 7000;

@Injectable()
export class HistoryService {
  private _history: Momento[];
  public expiry: number;
  public capacity: number;

  constructor() {
    this._history = new Array<Momento>();
    this.expiry = DEFAULT_EXPIRY;
    this.capacity = DEFAULT_CAPACITY;
  }

  push(momento: Momento) {
    this._history.push(momento);
    let diff = this._history.length - this.capacity;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this._history.shift();
      }
    }
    return Observable.create((subscriber) => {
      subscriber.next(1);
      subscriber.complete();
    }).delay(this.expiry)
      .subscribe(() => {
        this._history = new Array<Momento>();
    });
  }

  restore(count: number = 1) {
    for (let i = 0; i < count; i++) {
      let momento = this._history.pop();
      if (momento) {
        momento.rollback();
      }
    }
  }

  get isEmpty(): boolean {
    return !this._history.length;
  }

  get size(): number {
    return this._history.length;
  }

  get latest(): Momento {
    let len = this._history.length;
    if (len > 0) {
      return this._history[len - 1];
    }
  }
}
