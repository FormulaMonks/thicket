export const getGIFLink = (communityId, gifId) =>
  `${document.location.origin}${document.location.pathname}#g/${communityId}/${gifId}`

export const getCommunityInviteLink = communityId =>
  `${document.location.origin}${document.location.pathname}#c/${communityId}?token=${btoa(communityId)}`
