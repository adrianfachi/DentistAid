import { Module } from "@nestjs/common";
import { PostController } from "src/application/controllers/post.controller";
import { PostService } from "../services/post.service";
import { PostMapper } from "../mappers/post.mapper";


@Module({
    controllers: [PostController],
    providers: [PostService, PostMapper],
})
export class PostModule {}