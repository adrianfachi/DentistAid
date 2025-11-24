import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreatePostDto } from "src/domain/patient-aggregate/dtos/post/create-post.dto";
import { PostResponseDto } from "src/domain/patient-aggregate/dtos/post/post-response.dto";
import { UpdatePostDto } from "src/domain/patient-aggregate/dtos/post/update-content.dto";
import { PostService } from "src/domain/patient-aggregate/services/post.service";


@Controller("posts")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get("/patient/:patientId")
    async getAllPosts(@Param("patientId") patientId: number): Promise<PostResponseDto[]> {
        return await this.postService.showAllPostsByPatient(patientId);
    }

    @Get("deleted/:patientId")
    async getDeletedPostsByPatient(@Param("patientId") patientId: number): Promise<PostResponseDto[]> {
        return await this.postService.showAllDeletedPostsByPatient(patientId);
    }

    @Get(":postId")
    async getPostById(@Param("postId") postId: string): Promise<PostResponseDto> {
        return await this.postService.showPostById(postId);
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

    @Patch(":postId")
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }))
    async patchPost(
        @Param("postId") postId: string,
        @Body() input: UpdatePostDto
    ): Promise<PostResponseDto> {
        return await this.postService.editPost(postId, input);
    }

    @Delete(":postId")
    async deletePost(@Param("postId") postId: string): Promise<PostResponseDto> {
        return await this.postService.removePost(postId);
    }

    @Delete("restore/:postId")
    async restorePost(@Param("postId") postId: string): Promise<PostResponseDto> {
        return await this.postService.reactivatePost(postId);
    }
}