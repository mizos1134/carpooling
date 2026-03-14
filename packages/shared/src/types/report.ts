export enum ReportTargetType {
  User = 'user',
  Ride = 'ride',
  Review = 'review',
  Message = 'message',
}

export enum ReportReason {
  InappropriateBehavior = 'inappropriate_behavior',
  FakeProfile = 'fake_profile',
  FakeRide = 'fake_ride',
  Harassment = 'harassment',
  Spam = 'spam',
  AbusiveReview = 'abusive_review',
  Other = 'other',
}

export enum ReportStatus {
  Pending = 'pending',
  Reviewed = 'reviewed',
  Resolved = 'resolved',
  Dismissed = 'dismissed',
}

export enum BlockReason {
  Uncomfortable = 'uncomfortable',
  Harassment = 'harassment',
  NoShow = 'no_show',
  InappropriateMessages = 'inappropriate_messages',
  Other = 'other',
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserBlock {
  id: string;
  blockerId: string;
  blockedId: string;
  reason: BlockReason | null;
  createdAt: string;
}
