import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "../dtos/post/create-post.dto";
import { PostCreateInput, PostUpdateInput } from "generated/prisma/models";
import { Post } from "generated/prisma/client";
import { PostResponseDto } from "../dtos/post/post-response.dto";
import { UpdatePostDto } from "../dtos/post/update-content.dto";


@Injectable()
export class PostMapper {

    mapCreatePostToPrisma(dto: CreatePostDto): Omit<PostCreateInput, "patient"> {
        return {
            content: dto.content,
            image: dto.image,
        };
    }

    mapUpdatePostToPrisma(dto: UpdatePostDto): PostUpdateInput {
        return {
            content: dto.content,
            image: dto.image,
        }
    }

    mapPrismaToPostResponse(prisma: Post): PostResponseDto {
        return {
            postId: prisma.postId,
            patientId: prisma.patientId,
            content: prisma.content,
            image: prisma.image,
            createdAt: prisma.createdAt,
            updatedAt: prisma.updatedAt,
            deletedAt: prisma.deletedAt,
        }
    }
}