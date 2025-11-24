import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PostRepository } from "src/infrastructure/repositories/post.respository";
import { PostResponseDto } from "../dtos/post/post-response.dto";
import { PostMapper } from "../mappers/post.mapper";
import { CreatePostDto } from "../dtos/post/create-post.dto";


@Injectable()
export class PostService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly postMapper: PostMapper
    ) {}

    async showAllPosts(patientId: number): Promise<PostResponseDto[]> {
        let posts = await this.postRepository.fetchAllPosts(patientId);

        if(!posts) throw new NotFoundException("Error: could not find posts for the patient id.");
        posts = posts.map(p => this.postMapper.mapPrismaToPostResponse(p));
        return posts;
    }

    async showPostById(postId: string): Promise<PostResponseDto> {
        const post = await this.postRepository.fetchPostById(postId);

        if(!post) throw new NotFoundException("Error: could not find post by UUID.");
        return this.postMapper.mapPrismaToPostResponse(post);
    }

    async showAllDeletedPosts(patientId: number): Promise<PostResponseDto[]> {
        const posts = await this.postRepository.fetchDeletedPosts(patientId);

        if(!posts) throw new NotFoundException("Error: no posts have been deleted for given patient.");
        return posts.map(p => this.postMapper.mapPrismaToPostResponse(p));
    }

    async addPost(patientId: number, input: CreatePostDto): Promise<PostResponseDto> {
        const dto = this.postMapper.mapCreatePostToPrisma(input);
        const post = await this.postRepository.createPost(patientId, dto);

        if(!post) throw new InternalServerErrorException("Error: unkown error in creating post.");
        return this.postMapper.mapPrismaToPostResponse(post);
    }
}