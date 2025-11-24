import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DataBaseService } from "../services/database.service";
import { Post } from "generated/prisma/client";
import { PatientRepository } from "./patient.repository";
import { PostCreateInput, PostUpdateInput } from "generated/prisma/models";


@Injectable()
export class PostRepository {
    constructor(
        private readonly databaseService: DataBaseService,
        private readonly patientRepository: PatientRepository
    ) {}

    async fetchAllPostsByPatient(patientId: number): Promise<Post[] | null> {
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

    async fetchDeletedPostsByPatient(patientId: number): Promise<Post[] | null> {
        const patient = await this.patientRepository.fetchPatientById(patientId);

        if(!patient) throw new NotFoundException("Error: could not find patient by Id.");
        const posts = await this.databaseService.post.findMany({
            where: { patientId, deletedAt: { not: null } }
        });

        if(posts === undefined) throw new InternalServerErrorException("Database Error: could not fetch deleted posts for given patient.");
        return posts;
    }

    async fetchAllDeletedPosts(): Promise<Post[] | null> {
        const posts = await this.databaseService.post.findMany({
            where: { deletedAt: { not: null } }
        });

        if(posts === undefined) throw new InternalServerErrorException("Database Error: could not fetch deleted posts for given patient.");
        return posts;
    }

    async createPost(patientId: number, input: Omit<PostCreateInput, "patient">): Promise<Post | null> {
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

    updatePost(postId: string, data: Omit<PostUpdateInput, "patient">): Promise<Post | null> {
        const post = this.databaseService.post.update({
            where: { postId, deletedAt: null },
            data: data
        });

        if(post === undefined) throw new InternalServerErrorException("Database Error: could not update post for given Id.");
        return post;
    }

    deletePost(postId: string): Promise<Post | null> {
        const post = this.databaseService.post.update({
            where: { postId, deletedAt: null },
            data: { deletedAt: new Date() }
        });

        if(post === undefined) throw new InternalServerErrorException("Database Error: could not delete post for given Id.");
        return post;
    }

    restorePost(postId: string): Promise<Post | null> {
        const post = this.databaseService.post.update({
            where: { postId, deletedAt: { not: null } },
            data: { deletedAt: null }
        });

        if(post === undefined) throw new InternalServerErrorException("Database Error: could not restore post for given Id.");
        return post;
    }
}