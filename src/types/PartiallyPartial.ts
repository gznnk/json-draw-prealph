// https://qiita.com/aqua_ix/items/b3a9b920781d833cede8
export type PartiallyPartial<T, K extends keyof T> = Required<Omit<T, K>> &
	Partial<Pick<T, K>>;
