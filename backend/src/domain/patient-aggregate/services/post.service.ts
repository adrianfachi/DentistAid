import { Injectable, NotFoundException } from "@nestjs/common";
import { PostRepository } from "src/infrastructure/repositories/post.respository";
import { PostResponseDto } from "../dtos/post/post-response.dto";


@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository) {}

    // async findAllPosts(patientId: number): Promise<PostResponseDto[]> {
    //     const posts = await this.postRepository.fetchAllPosts(patientId);

    //     if(!posts) throw new NotFoundException("Error: could not find posts for the patient Id.");
    //     // return posts;
    // }
}