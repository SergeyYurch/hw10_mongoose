import {Router} from "express";
import 'reflect-metadata';

import {validatorMiddleware} from "../middlewares/validator.middleware";
import {authBasicMiddleware} from "../middlewares/authBasic.middleware";
import {blogsController} from '../composition-root/compositiomRoot';
import {authCheckBearerMiddleware} from '../middlewares/authCheckBearer.middleware';

// const blogsController = new BlogsController(
//     new BlogsService(new BlogsRepository(), new QueryRepository(new UsersRepository())),
//     new QueryRepository(new UsersRepository()),
//     new PostsService(new PostsRepository(), new QueryRepository(new UsersRepository())))
// const blogsController = appContainer.get<BlogsController>(TYPES.BlogsController)
export const blogsRouter = Router();

const {
    validateBlogInputModel,
    validatePostInputModel,
    validateResult
} = validatorMiddleware;

blogsRouter.get('/',
    authCheckBearerMiddleware,
    blogsController.getBlogs.bind(blogsController)
);

blogsRouter.post('/',
    authBasicMiddleware,
    validateBlogInputModel(),
    validateResult,
    blogsController.createBlog.bind(blogsController)
);

blogsRouter.get('/:id',
    authCheckBearerMiddleware,
    blogsController.getBlog.bind(blogsController)
);


blogsRouter.get('/:id/posts',
    authCheckBearerMiddleware,
    blogsController.getPostsForBlog.bind(blogsController)
);

blogsRouter.post('/:id/posts',
    authBasicMiddleware,
    validatePostInputModel(),
    validateResult,
    blogsController.createPostForBlog.bind(blogsController)
);

blogsRouter.put('/:id',
    authBasicMiddleware,
    validateBlogInputModel(),
    validateResult,
    blogsController.editBlog.bind(blogsController)
);

blogsRouter.delete('/:id',
    authBasicMiddleware,
    blogsController.deleteBlog.bind(blogsController)
);
