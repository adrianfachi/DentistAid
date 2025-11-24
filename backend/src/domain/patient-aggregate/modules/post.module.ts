import { Module } from "@nestjs/common";
import { PostController } from "src/application/controllers/post.controller";
import { PostService } from "../services/post.service";
import { PostMapper } from "../mappers/post.mapper";
import { InfrastructureModule } from "src/infrastructure/modules/infrastructure.module";


@Module({
    controllers: [PostController],
    providers: [PostService, PostMapper],
    imports: [InfrastructureModule],
})
export class PostModule {}