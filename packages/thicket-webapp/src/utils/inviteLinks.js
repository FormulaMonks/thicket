export const getCommunityInviteLink = communityId =>
  document.location.origin + '/c/' + communityId + '?token=' + btoa(communityId)
