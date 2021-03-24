import PostOptionsInput from './inputs/PostOptionsInput';

export default function getPostOptions({
  communityId,
  status,
  tagIds,
}: PostOptionsInput) {
  return {
    ...(status
      ? {
          status,
        }
      : {}),
    ...(communityId
      ? {
          community: communityId,
        }
      : {}),
    ...(tagIds
      ? {
          tags: { $in: tagIds },
        }
      : {}),
  };
}
