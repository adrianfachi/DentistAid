import { PostContent } from "../value_objects/post-content.vo";




export class Post {
    constructor(
        public readonly postId: string,
        public readonly patientId: string,
        private content: PostContent,
    ) {}

    updateContent(newContent: PostContent) {
        this.content = newContent;
    }

    getContent(): PostContent {
        return this.content;
    }
}