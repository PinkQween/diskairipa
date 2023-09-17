export default interface permissions {
    // Owner permission
    isOwner: boolean;

    // General permissions
    canViewChannels: boolean;
    canManageChannels: boolean;
    canManageRoles: boolean;
    canManageEmojisAndStickers: boolean;
    canViewAuditLog: boolean;
    canViewServerInsights: boolean;
    canManageServer: boolean;
    canCreateInvite: boolean;
    canChangeNickname: boolean;
    canManageNicknames: boolean;
    canKickMembers: boolean;
    canBanMembers: boolean;
    canAdministrator: boolean;

    // Text permissions
    canSendMessages: boolean;
    canEmbedLinks: boolean;
    canAttachFiles: boolean;
    canAddReactions: boolean;
    canUseExternalEmoji: boolean;
    canUseExternalStickers: boolean;
    canMentionEveryoneAndRoles: boolean;
    canManageMessages: boolean;
    canReadMessageHistory: boolean;
}