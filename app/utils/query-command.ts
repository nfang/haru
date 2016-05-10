const _ = require('lodash');

export enum SortOrder {
  ASC,
  DESC
}

export class SortSpec {
  iteratees: string[];
  orders: SortOrder[];

  constructor(iteratees = [], orders = [SortOrder.ASC]) {
    this.iteratees = iteratees;
    this.orders = orders;
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
