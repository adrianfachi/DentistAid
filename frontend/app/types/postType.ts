type postType = {
	postId: string;
	content: string;
	image?: string[];
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt?: Date;
};
