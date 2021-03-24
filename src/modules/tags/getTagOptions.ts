import TagOptionsInput from './inputs/TagOptionsInput';

export default function getTagOptions({ communityId }: TagOptionsInput) {
  return {
    ...(communityId
      ? {
          community: communityId,
        }
      : {}),
  };
}
