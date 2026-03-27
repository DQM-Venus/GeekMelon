export interface FeedRecord {
  id: number
  source: string
  sourceUrl: string
  title: string
  authorName: string
  summary: string
  highlight: string
  category: string
  tags: readonly string[]
  spicyIndex: number
  rawPublishTime: string
  createdAt: string
  displayTitle?: string | null
  displayHighlight?: string | null
  displaySummary?: string | null
  adminEdited?: boolean | null
  editorPick?: boolean | null
  adminFeatured?: boolean | null
}

export interface FeedPageResult {
  records: FeedRecord[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface RelatedSourceRecord {
  id: number
  source: string
  sourceUrl: string
  title: string
  authorName: string
  spicyIndex: number
  rawPublishTime: string
  createdAt: string
  primarySource: boolean
}

export interface FeedDetailRecord {
  id: number
  source: string
  sourcePostId: string
  sourceUrl: string
  title: string
  authorName: string
  rawContent: string
  rawPublishTime: string
  summary: string
  highlight: string
  category: string
  tags: readonly string[]
  spicyIndex: number
  verdict: string
  dropReason?: string
  aiModel: string
  aiPromptVersion: string
  status: string
  createdAt: string
  updatedAt: string
  relatedSources: readonly RelatedSourceRecord[]
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface FeedQueryParams {
  page: number
  pageSize: number
  dateScope: 'yesterday'
  sort: 'latest' | 'spicy'
  fetchAll?: boolean
}

export interface AdminAuthRecord {
  username: string
  displayName: string
}

export interface AdminDashboardRecord {
  todayNewCount: number
  hiddenCount: number
  featuredCount: number
  activeSourceCount: number
  editorialEnabled: boolean
  deepseekConfigured: boolean
  editorialModel: string
  crawlerPythonCommand: string
  crawlerWorkingDirectory: string
  recentRuns: AdminTaskRunRecord[]
}

export interface AdminFeedListRecord {
  id: number
  source: string
  sourceUrl: string
  title: string
  adminTitle?: string | null
  authorName: string
  category: string
  adminCategory?: string | null
  spicyIndex: number
  adminSpicyIndex?: number | null
  status: 'active' | 'hidden'
  duplicateOfId?: number | null
  editorPick?: boolean | null
  adminFeatured?: boolean | null
  adminFeaturedRank?: number | null
  rawPublishTime?: string | null
  firstSeenAt: string
  lastSeenAt: string
  createdAt: string
  updatedAt: string
  adminUpdatedAt?: string | null
  tags: readonly string[]
}

export interface AdminFeedPageResult {
  records: AdminFeedListRecord[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminFeedDetailRecord {
  id: number
  source: string
  sourcePostId: string
  sourceUrl: string
  title: string
  adminTitle?: string | null
  authorName: string
  rawContent: string
  rawPublishTime?: string | null
  summary: string
  adminSummary?: string | null
  highlight: string
  adminHighlight?: string | null
  category: string
  adminCategory?: string | null
  tags: readonly string[]
  spicyIndex: number
  adminSpicyIndex?: number | null
  verdict: string
  dropReason?: string | null
  aiModel?: string | null
  aiPromptVersion?: string | null
  status: 'active' | 'hidden'
  duplicateOfId?: number | null
  editorPick?: boolean | null
  adminFeatured?: boolean | null
  adminFeaturedRank?: number | null
  adminNote?: string | null
  firstSeenAt: string
  lastSeenAt: string
  createdAt: string
  updatedAt: string
  adminUpdatedAt?: string | null
  relatedSources: readonly RelatedSourceRecord[]
}

export interface AdminFeedQueryParams {
  page: number
  pageSize: number
  keyword: string
  source: string
  category: string
  status: string
  editorPick: string
  featured: string
  duplicateGroup: string
}

export interface AdminFeedUpdatePayload {
  status?: 'active' | 'hidden'
  adminTitle?: string
  adminHighlight?: string
  adminSummary?: string
  adminCategory?: string
  adminSpicyIndex?: number
  adminFeatured?: boolean
  adminFeaturedRank?: number
  adminNote?: string
}

export interface AdminSourceRecord {
  sourceKey: string
  displayName: string
  enabled: boolean
  maxItems: number
  runOrder: number
  updatedAt: string
}

export interface AdminTaskRunRecord {
  id: number
  runId: string
  sourceKey: string
  triggerType: string
  status: string
  startedAt: string
  endedAt?: string | null
  createdCount: number
  updatedCount: number
  skippedCount: number
  filteredCount: number
  errorCategory?: string | null
  errorDetail?: string | null
}
