import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreatePostDto } from "src/domain/patient-aggregate/dtos/post/create-post.dto";
import { PostResponseDto } from "src/domain/patient-aggregate/dtos/post/post-response.dto";
import { PostService } from "src/domain/patient-aggregate/services/post.service";


@Controller("posts")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get(":patientId")
    async getAllPosts(@Param("patientId") patientId: number): Promise<PostResponseDto[]> {
        return await this.postService.showAllPosts(patientId);
    }

    @Post(":patientId")
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }))
    async postPost(
        @Param("patientId") patientId: number,
        @Body() input: CreatePostDto
    ): Promise<PostResponseDto> {
        return await this.postService.addPost(patientId, input);
    }
}