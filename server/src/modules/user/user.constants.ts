export const ALLOWED_GOOGLE_AVATAR_HOSTS = ['lh3.googleusercontent.com']
export const LAST_SEEN_PATH = 'public.lastSeen'
export const USER_PASSWORD_PATH = 'system.password'
export const ADMIN_USER_LIST_PER_PAGE_LIMIT = 500
export const ADMIN_USER_DEFAULT_PER_PAGE = 10
export const ADMIN_USER_DEFAULT_PAGE = 1
export const ADMIN_USER_DEFAULT_SORT_BY = '_id'
export const ADMIN_USER_SORT_PATHS = [
  '_id',
  'public.nickname',
  'personal.email',
  'system.role',
  LAST_SEEN_PATH,
  'createdAt',
  'updatedAt'
] as const
