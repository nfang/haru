import {Injectable} from '@angular/core';

export class Momento {
  constructor(
    public actionName: string,
    public rollback: () => void
  ) { }
}

const DEFAULT_CAPACITY = 1;
const DEFAULT_EXPIRY = 7000;

@Injectable()
export class HistoryService {
  private _history: Momento[];
  private _timeout;
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

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    this._timeout = setTimeout((() => {
      this._history = new Array<Momento>();
    }).bind(this), this.expiry);
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

  get last(): Momento {
    let len = this._history.length;
    if (len > 0) {
      return this._history[len - 1];
    }
  }
}
