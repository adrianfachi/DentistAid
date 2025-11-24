import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PostRepository } from "src/infrastructure/repositories/post.respository";
import { PostResponseDto } from "../dtos/post/post-response.dto";
import { PostMapper } from "../mappers/post.mapper";
import { CreatePostDto } from "../dtos/post/create-post.dto";
import { UpdatePostDto } from "../dtos/post/update-content.dto";


@Injectable()
export class PostService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly postMapper: PostMapper
    ) {}

    async showAllPosts(patientId: number): Promise<PostResponseDto[]> {
        let posts = await this.postRepository.fetchAllPostsByPatient(patientId);

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
        const posts = await this.postRepository.fetchDeletedPostsByPatient(patientId);

        if(!posts) throw new NotFoundException("Error: no posts have been deleted for given patient.");
        return posts.map(p => this.postMapper.mapPrismaToPostResponse(p));
    }

    async addPost(patientId: number, input: CreatePostDto): Promise<PostResponseDto> {
        const dto = this.postMapper.mapCreatePostToPrisma(input);
        const post = await this.postRepository.createPost(patientId, dto);

        if(!post) throw new InternalServerErrorException("Error: unkown error in creating post.");
        return this.postMapper.mapPrismaToPostResponse(post);
    }

    async editPost(postId: string, input: UpdatePostDto): Promise<PostResponseDto> {
        const dto = this.postMapper.mapUpdatePostToPrisma(input);
        const post = await this.postRepository.updatePost(postId, dto);

        if(!post) throw new NotFoundException("Error: could not find post by UUID to update.");
        return this.postMapper.mapPrismaToPostResponse(post);
    }

    async removePost(postId: string): Promise<PostResponseDto> {
        const p = await this.postRepository.fetchPostById(postId);

        if(!p) throw new NotFoundException("Error: post does not exist or has already been deleted.");
        const post = await this.postRepository.deletePost(postId);

        if(!post) throw new NotFoundException("Error: unkown error finding post to delete.");
        return this.postMapper.mapPrismaToPostResponse(post);
    }

    async reactivatePost(postId: string): Promise<PostResponseDto> {
        const delposts = await this.postRepository.fetchAllDeletedPosts();

        if(!delposts) throw new NotFoundException("Error: no posts have been deleted.");
        const p = delposts.find(p => p.postId === postId);

        if(!p) throw new NotFoundException("Error: post does not exist or is already active.");
        const post = await this.postRepository.deletePost(postId);

        if(!post) throw new NotFoundException("Error: unkown error finding post to reactivate.");
        return this.postMapper.mapPrismaToPostResponse(post);
    }
}