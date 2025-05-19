import type { Work } from "../../domain/Work";

export interface WorkRepository {
	saveWorks(works: Work[]): Promise<void>;
	getWorks(): Promise<Work[]>;
}
