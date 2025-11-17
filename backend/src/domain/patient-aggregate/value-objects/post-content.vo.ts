export class PostContent {
    constructor(
        private readonly text: string,
        private readonly images: string[],
    ) {}

    static create(text: string, images: string[]): PostContent {
        return new PostContent(text, images);
    }

    getText(): string {
        return this.text;
    }

    getImages(): string[] {
        return this.images;
    }

    equals(other: PostContent): boolean {
        return this.text === other.text &&
               this.images.length === other.images.length &&
               this.images.every((img, index) => img === other.images[index]);
    }
}