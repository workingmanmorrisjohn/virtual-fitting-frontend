import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import type { Post } from "../../types/Post";
import { useDeletePost } from "../../hooks/usePosts";
import { getFileURL } from "../../utils/UtilityFunctions";
import { usePost } from "../../context/PostContext";

interface PostItemProps {
    post: Post
}

const PostItem = ({ post }: PostItemProps) => {
    const {mutate: deletePost} = useDeletePost();
    const {editPost} = usePost();

    const image = getFileURL(post);

    return (
        <>
            <div className="p-2 w-full max-w-md group overflow-hidden min-h-[115px]">
                <div className="flex w-full items-center flex-row justify-between">
                    <h2 className="text-xl font-bold">{post.title}</h2>

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button">
                            <EllipsisVerticalIcon size={20} className="hover:bg-gray-50 cursor-pointer rounded-full" />
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                            <li onClick={() => editPost(post)}><a><PencilIcon size={14} /> Edit</a></li>
                            <li className="text-red-500" onClick={() =>deletePost(post.id)}><a><TrashIcon size={14} /> Delete</a></li>
                        </ul>

                    </div>
                </div>

                <p className="text-xs text-gray-600 mb-4">
                    Updated: {post.modified.toDateString()}
                </p>

                {
                    image &&
                    <figure className="relative overflow-hidden">

                        <img
                            src={image}
                            alt={post.title}
                            className="w-full h-52 object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                    </figure>

                }


                <p className="mt-4 whitespace-pre-line text-sm">{post.text}</p>
            </div>
            <div className='divider' />
        </>

    );
}

export default PostItem;
