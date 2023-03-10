import {PostViewModelDto} from "../controllers/dto/viewModels/postViewModel.dto";
import {PostInputModelDto} from "../controllers/dto/inputModels/postInputModel.dto";
import {PostEntity} from "./entities/post.entity";
import {PostEditEntity} from "./entities/postEdit.entity";
import {QueryRepository} from "../repositories/query.repository";
import {PostsRepository} from "../repositories/posts.repository";
import {injectable} from 'inversify';
import {LikeStatusType} from '../repositories/interfaces/likeStatus.type';
import {LikesRepository} from '../repositories/likes.repository';


@injectable()
export class PostsService {
    constructor(
        protected postsRepository: PostsRepository,
        protected queryRepository: QueryRepository,
        protected likesRepository: LikesRepository
    ) {
    }

    async createNewPost(post: PostInputModelDto): Promise<PostViewModelDto | null> {
        const {title, shortDescription, content, blogId} = post;
        const blogName = (await this.queryRepository.getBlogById(blogId))?.name;
        if (!blogName) return null;
        const createdAt = new Date().toISOString();
        const newPost: PostEntity = {
            title, shortDescription, content, blogId, blogName, createdAt
        };
        const postInDb = await this.postsRepository.createNewPost(newPost);
        if (!postInDb) return null;
        return {
            id: postInDb._id.toString(),
            title: postInDb.title,
            shortDescription: postInDb.shortDescription,
            content: postInDb.content,
            blogId: postInDb.blogId,
            blogName: postInDb.blogName,
            createdAt: postInDb.createdAt,
            extendedLikesInfo:{
                likesCount:0,
                dislikesCount:0,
                myStatus: 'None',
                newestLikes: []
            }
        };
    }

    async editPostById(id: string, post: PostInputModelDto): Promise<boolean> {
        const {title, shortDescription, content, blogId} = post;
        const blogName = (await this.queryRepository.getBlogById(blogId))?.name;
        if (!blogName) return false;
        const postToDb: PostEditEntity = {
            title,
            blogId,
            content,
            shortDescription,
            blogName
        };
        return await this.postsRepository.updatePostById(id, postToDb);
    }

    async deletePostById(id: string): Promise<boolean> {
        return this.postsRepository.deletePostById(id);
    }

    async changePostsLikeStatus(postId: string, userId: string, likeStatus: LikeStatusType): Promise<boolean> {
        console.log(`[postsService] comment id:${postId} like/dislike`);
        const login = (await this.queryRepository.getUserById(userId))!.accountData.login
        return await this.likesRepository.updateLikeItem(postId, userId, login, likeStatus);
    }
}