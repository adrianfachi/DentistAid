import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DataBaseService } from "../services/database.service";
import { Post } from "generated/prisma/client";
import { PatientRepository } from "./patient.repository";
import { PostCreateInput } from "generated/prisma/models";


@Injectable()
export class PostRepository {
    constructor(
        private readonly databaseService: DataBaseService,
        private readonly patientRepository: PatientRepository
    ) {}

    async fetchAllPosts(patientId: number): Promise<Post[] | null> {
        const patient = await this.patientRepository.fetchPatientById(patientId);

        if(!patient) throw new NotFoundException("Error: could not find patient by Id.");
        const posts = await this.databaseService.post.findMany({
            where: { patientId, deletedAt: null }
        });

        if(posts === undefined) throw new InternalServerErrorException("Database Error: could not fetch posts for given patient.");
        return posts;
    }

    async fetchPostById(postId: string): Promise<Post | null> {
        const post = await this.databaseService.post.findUnique({
            where: { postId, deletedAt: null }
        });

        if(post === undefined) throw new InternalServerErrorException("Database Error: could not fetch post by Id.");
        return post;
    }

    async fetchDeletedPosts(patientId: number): Promise<Post[] | null> {
        const patient = await this.patientRepository.fetchPatientById(patientId);

        if(!patient) throw new NotFoundException("Error: could not find patient by Id.");
        const posts = await this.databaseService.post.findMany({
            where: { patientId, deletedAt: { not: null } }
        });

        if(posts === undefined) throw new InternalServerErrorException("Database Error: could not fetch deleted posts for given patient.");
        return posts;
    }

    async createPost(patientId: number, input: PostCreateInput): Promise<Post | null> {
        const patient = await this.patientRepository.fetchPatientById(patientId);

        if(!patient) throw new NotFoundException("Error: could not find patient by Id.");
        const post = await this.databaseService.post.create({
            data: {
                ...input,
                patient: {
                    connect: { patientId }
                }
            }
        });

        if(post === undefined) throw new InternalServerErrorException("Database Error: could not create post for given patient.");
        return post;
    }

    updatePost(id: string, data: any) {}

    deletePost(id: string) {}

    restorePost(id: string) {}
}