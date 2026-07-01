import type { Assessment } from "../types/assessment.types";

class AssessmentStore {
	private assessments: Map<string, Assessment> = new Map();

	save(assessment: Assessment): void {
		this.assessments.set(assessment.id, assessment);
	}

	findById(id: string): Assessment | undefined {
		return this.assessments.get(id);
	}

	delete(id: string): boolean {
		return this.assessments.delete(id);
	}

	getAll(): Assessment[] {
		return Array.from(this.assessments.values());
	}
}

// Singleton instance — swap this out for a DB-backed repo in future
export const assessmentStore = new AssessmentStore();
