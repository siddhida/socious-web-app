import { CreatePostBodyType, EditPostBodyType, SharePostBodyType } from '@models/post';
import { deleteRequest, post, put } from 'utils/request';
 
export function createPost(postBody: CreatePostBodyType) {
  return post("/api/v2/posts",
        postBody,
  );
}


// LIKE UNLIKE
export function likePost(id: string) {
  return put(`/api/v2/posts/${id}/like`, {});
}

export function unlikePost(id: string) {
  return deleteRequest(`/api/v2/posts/${id}/like`);
};

export function sharePost(postBody: SharePostBodyType, postId: string) {
  return post(`/api/v2/posts/${postId}/share`, postBody);
}

export function editPost(postBody: EditPostBodyType, postId: string) {
  return put(`/api/v2/posts/${postId}`, postBody);
}
