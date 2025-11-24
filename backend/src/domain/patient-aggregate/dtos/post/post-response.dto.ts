export class PostResponseDto {
    postId: string;
    content: string;
    image: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    patientId: number;
}