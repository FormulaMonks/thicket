export const getGIFLink = (communityId, gifId) => `${document.location.origin}/g/${communityId}/${gifId}`

export const getCommunityInviteLink = communityId =>
  document.location.origin + '/c/' + communityId + '?token=' + btoa(communityId)
