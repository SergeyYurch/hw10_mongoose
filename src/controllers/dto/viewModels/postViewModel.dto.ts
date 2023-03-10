import {ExtendedLikesInfoViewModel} from './extendedLikesInfoViewModel';

export interface PostViewModelDto {
    id:string;
    title:string;
    shortDescription:string;
    content: string;
    blogId:string;
    blogName:string;
    createdAt:string;
    extendedLikesInfo: ExtendedLikesInfoViewModel
}
