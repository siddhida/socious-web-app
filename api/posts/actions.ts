import {
  CreatePostBodyType,
  EditPostBodyType,
  SharePostBodyType,
} from '@models/post';
import {deleteRequest, post, put} from 'utils/request';

export function createPost(postBody: CreatePostBodyType) {
  return post('/posts', postBody);
}

// LIKE UNLIKE
export function likePost(id: string) {
  return post(`/posts/${id}/like`);
}

export function unlikePost(id: string) {
  return post(`/posts/${id}/unlike`);
}

export function sharePost(postBody: SharePostBodyType, postId: string) {
  return post(`/posts/${postId}/share`, postBody);
}

export function editPost(postBody: EditPostBodyType, postId: string) {
  return post(`/posts/update/${postId}`, postBody);
}

export function deletePost(postId: string) {
  return post(`/posts/remove/${postId}`);
}
