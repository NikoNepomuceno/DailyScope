export const postsKey = ['posts'] as const;
export const postKey = (id: number) => ['post', id] as const;

export const QueryKeys = {
  posts: postsKey,
  post: postKey,
} as const;