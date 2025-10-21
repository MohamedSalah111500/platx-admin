export interface SubscriptionPlan {
	name: string;
	displayName?: string;
	description?: string;
	monthlyPrice?: number;
	yearlyPrice?: number;
	originalPrice?: number;
	maxStudents?: number;
	maxCourses?: number;
	maxVideoSizeGB?: number;
	hasSpecializedOptions?: boolean;
	hasCustomUI?: boolean;
	hasQuizAndAssignments?: boolean;
	hasTechnicalSupport?: boolean;
	hasDocumentAndMedia?: boolean;
	hasLifelongAccess?: boolean;
	hasAdvancedReports?: boolean;
	sortOrder?: number;
	isFeatured?: boolean;
	isPopular?: boolean;
	[key: string]: any;
}
