import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Endpoints } from '@/constants/api';
import { QueryKeys } from '@/constants/queryKeys';
import { post } from '@/services/requestService';
import type { Post, CreatePostInput } from '@/interfaces/post';

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newPost: CreatePostInput) => post<Post, CreatePostInput>(Endpoints.posts, newPost),
    onSuccess: () => {
      // Invalidate and refetch posts after creating a new one
      queryClient.invalidateQueries({ queryKey: QueryKeys.posts });
    },
  });
}