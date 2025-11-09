import { useQuery } from '@tanstack/react-query';
import { Endpoints } from '@/constants/api';
import { QueryKeys } from '@/constants/queryKeys';
import { get } from '@/services/requestService';
import type { Post } from '@/interfaces/post';

export function usePosts() {
  return useQuery({
    queryKey: QueryKeys.posts,
    queryFn: () => get<Post[]>(Endpoints.posts),
  });
}