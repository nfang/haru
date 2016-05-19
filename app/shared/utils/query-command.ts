const _ = require('lodash');

/**
 * As string enum's kinda not ready, we use `any` cast as a workaround
 * (https://github.com/Microsoft/TypeScript/issues/3192).
 */
export enum SortOrder {
  ASC = 'asc' as any,
  DESC = 'desc' as any
}

export class SortSpec {
  iteratees: string[];
  orders: SortOrder[];

  constructor(iteratees = [], orders: SortOrder[] = [SortOrder.ASC]) {
    this.iteratees = iteratees;
    this.orders = orders;

    if (this.iteratees.length > this.orders.length) {
      let diff = this.iteratees.length - this.orders.length;
      let pad = this.orders[this.orders.length - 1];
      this.orders = _.concat(this.orders, _.fill(Array(diff), pad));
    }
  }
}

export class FilterSpec {
  predicate: (item: any) => boolean;

  constructor(predicate = (item) => true) {
    this.predicate = predicate;
  }
}

export class QueryCommand {
  filter: FilterSpec;
  sortBy: SortSpec;

  execute(targets) {
    let subset = targets;

    if (this.filter) {
      subset = subset.filter(this.filter.predicate);
    }

    if (this.sortBy && this.sortBy.iteratees && this.sortBy.iteratees.length) {
      subset = _.orderBy(subset, this.sortBy.iteratees, this.sortBy.orders);
    }

    return subset;
  }
}
