import {CommentModel, commentsCollection} from "../adapters/dbAdapters";
import {ObjectId} from "mongodb";
import {CommentEntity} from "../services/entities/comment.entity";
import {CommentInputModelDto} from "../controllers/dto/commentInputModel.dto";

export class CommentsRepository {
    async createNewUserComment(comment: CommentEntity): Promise<string | null> {
        const result = await CommentModel.create(comment);
        return result._id.toString() || null;
    }
    async deleteUserCommentById (id: string): Promise<boolean>{
        console.log(`[commentsRepository]: delete comment id: ${id}`);
        const result = await CommentModel.deleteOne({_id: new ObjectId(id)});
        return result.acknowledged;
    }
    async editComment (id: string, {content}:CommentInputModelDto): Promise<boolean> {
        console.log(`[commentsRepository]: comment id: ${id} edit`);
        const result = await CommentModel.updateOne({_id: new ObjectId(id)},{$set:{content}});
        return result.acknowledged;
    }
}