import { formatHumanDateTime, isNumber, isString, type MediaBucketName, type UnknownObject } from 'global-shared'

import { SERVER_ENV } from 'src/app/env'

import { ADMIN_MEDIA_PREVIEW_BASE_PATH, STREAM_MEDIA_BUCKET_NAMES } from './media.constants'
import { MEDIA_FILE_MODEL_BY_BUCKET } from './media.model'
import { deleteBucketFileById } from './media.service'

const ADMIN_MEDIA_NAVIGATION = 'Media'
export const ADMIN_MEDIA_PREVIEW_COMPONENT = 'AdminMediaPreview'
const ADMIN_MEDIA_DOWNLOAD_URL_PATH = 'downloadUrl'
const ADMIN_MEDIA_PREVIEW_PATH = 'preview'
const ADMIN_MEDIA_PREVIEW_URL_PATH = 'previewUrl'
const ADMIN_MEDIA_UPLOAD_DATE_PATH = 'uploadDate'
const ADMIN_MEDIA_RESOURCE_LABEL_BY_BUCKET = {
  audio: 'Audio',
  doc: 'Documents',
  image: 'Images',
  video: 'Videos'
} as const satisfies Record<MediaBucketName, string>

interface AdminMediaRecord {
  id?: string
  params?: UnknownObject
}

interface AdminMediaActionResponse {
  record?: AdminMediaRecord
  records?: AdminMediaRecord[]
}

interface AdminMediaActionRequest {
  method: 'get' | 'post'
  params: {
    recordId?: string
  }
}

interface AdminMediaActionContext {
  currentAdmin?: unknown
  h: {
    resourceUrl: (params: { resourceId: string }) => string
  }
  record?: {
    id: () => string
    toJSON: (currentAdmin?: unknown) => UnknownObject
  }
  records?: {
    id: () => string
    toJSON: (currentAdmin?: unknown) => UnknownObject
  }[]
  resource: {
    _decorated?: {
      id: () => string
    }
    id: () => string
  }
}

interface AdminMediaRecordActionResponse {
  notice?: UnknownObject
  record: UnknownObject
  redirectUrl?: string
}

interface AdminMediaBulkActionResponse {
  notice?: UnknownObject
  records: UnknownObject[]
  redirectUrl?: string
}

const resolveAdminResourceId = (context: AdminMediaActionContext) =>
  context.resource._decorated?.id() || context.resource.id()

const formatMediaDateParam = (params: AdminMediaRecord['params'], path: string) => {
  if (!params) {
    return
  }

  const value = params[path]
  if (value instanceof Date) {
    params[path] = formatHumanDateTime(value.toISOString())
    return
  }

  if (!isNumber(value) && !isString(value)) {
    return
  }

  params[path] = formatHumanDateTime(value)
}

const withFormattedMediaDates = (response: AdminMediaActionResponse) => {
  formatMediaDateParam(response.record?.params, ADMIN_MEDIA_UPLOAD_DATE_PATH)
  response.records?.forEach((record) => formatMediaDateParam(record.params, ADMIN_MEDIA_UPLOAD_DATE_PATH))

  return response
}

const resolveAdminMediaRecordId = (record: AdminMediaRecord) => {
  const id = record.params?._id ?? record.id

  return id ? String(id) : ''
}

const assignAdminMediaPreviewUrls = (record: AdminMediaRecord | undefined, bucketName: MediaBucketName) => {
  if (!record?.params) {
    return
  }

  const id = resolveAdminMediaRecordId(record)

  if (!id) {
    return
  }

  const previewUrl = `${
    SERVER_ENV.adminjs.adminRootPath
  }${ADMIN_MEDIA_PREVIEW_BASE_PATH}/${bucketName}/${encodeURIComponent(id)}`

  record.params[ADMIN_MEDIA_PREVIEW_URL_PATH] = previewUrl
  record.params[ADMIN_MEDIA_DOWNLOAD_URL_PATH] = `${previewUrl}?download=1`
}

const withAdminMediaPreviewUrls = (response: AdminMediaActionResponse, bucketName: MediaBucketName) => {
  assignAdminMediaPreviewUrls(response.record, bucketName)

  return response
}

const deleteMediaFile = async (
  bucketName: MediaBucketName,
  request: AdminMediaActionRequest,
  context: AdminMediaActionContext
): Promise<AdminMediaRecordActionResponse> => {
  const { record, currentAdmin, h } = context

  if (!request.params.recordId || !record) {
    throw new Error('Media file was not found')
  }

  const recordJson = record.toJSON(currentAdmin)

  if (request.method === 'get') {
    return {
      record: recordJson
    }
  }

  await deleteBucketFileById(bucketName, record.id())

  return {
    record: recordJson,
    redirectUrl: h.resourceUrl({ resourceId: resolveAdminResourceId(context) }),
    notice: {
      message: 'successfullyDeleted',
      type: 'success'
    }
  }
}

const bulkDeleteMediaFiles = async (
  bucketName: MediaBucketName,
  request: AdminMediaActionRequest,
  context: AdminMediaActionContext
): Promise<AdminMediaBulkActionResponse> => {
  const { records, currentAdmin, h } = context

  if (!records?.length) {
    throw new Error('No media files were selected')
  }

  const recordJsonItems = records.map((record) => record.toJSON(currentAdmin))

  if (request.method === 'get') {
    return {
      records: recordJsonItems
    }
  }

  await Promise.all(records.map((record) => deleteBucketFileById(bucketName, record.id())))

  return {
    records: recordJsonItems,
    redirectUrl: h.resourceUrl({ resourceId: resolveAdminResourceId(context) }),
    notice: {
      message: records.length > 1 ? 'successfullyBulkDeleted_plural' : 'successfullyBulkDeleted',
      options: { count: records.length },
      resourceId: resolveAdminResourceId(context),
      type: 'success'
    }
  }
}

const buildAdminMediaOptions = (bucketName: MediaBucketName) => ({
  resource: MEDIA_FILE_MODEL_BY_BUCKET[bucketName],
  options: {
    id: `media-${bucketName}`,
    navigation: ADMIN_MEDIA_NAVIGATION,
    titleProperty: 'filename',
    sort: {
      sortBy: ADMIN_MEDIA_UPLOAD_DATE_PATH,
      direction: 'desc'
    },
    listProperties: ['_id', 'filename', 'metadata.kind', 'contentType', 'metadata.size', ADMIN_MEDIA_UPLOAD_DATE_PATH],
    showProperties: [
      ADMIN_MEDIA_PREVIEW_PATH,
      '_id',
      'filename',
      'contentType',
      'length',
      'chunkSize',
      ADMIN_MEDIA_UPLOAD_DATE_PATH,
      'metadata.size',
      'metadata.kind',
      'metadata.sha256',
      'metadata.detectedMime',
      'metadata.detectedExt',
      'metadata.width',
      'metadata.height',
      'metadata.orientation'
    ],
    filterProperties: [
      '_id',
      'filename',
      'contentType',
      'metadata.kind',
      'metadata.sha256',
      ADMIN_MEDIA_UPLOAD_DATE_PATH
    ],
    actions: {
      new: {
        isAccessible: false
      },
      edit: {
        isAccessible: false
      },
      delete: {
        handler: async (request: AdminMediaActionRequest, _response: unknown, context: AdminMediaActionContext) =>
          deleteMediaFile(bucketName, request, context)
      },
      bulkDelete: {
        handler: async (request: AdminMediaActionRequest, _response: unknown, context: AdminMediaActionContext) =>
          bulkDeleteMediaFiles(bucketName, request, context)
      },
      list: {
        after: async (response: AdminMediaActionResponse) => withFormattedMediaDates(response)
      },
      show: {
        after: async (response: AdminMediaActionResponse) =>
          withAdminMediaPreviewUrls(withFormattedMediaDates(response), bucketName)
      }
    },
    properties: {
      [ADMIN_MEDIA_PREVIEW_PATH]: {
        components: {
          show: ADMIN_MEDIA_PREVIEW_COMPONENT
        },
        custom: {
          previewBasePath: `${ADMIN_MEDIA_PREVIEW_BASE_PATH}/${bucketName}`
        },
        isVisible: {
          edit: false,
          filter: false,
          list: false,
          show: true
        },
        label: 'Preview',
        type: 'string'
      },
      _id: {
        label: 'ID'
      },
      chunkSize: {
        label: 'Chunk Size'
      },
      contentType: {
        label: 'Content Type'
      },
      filename: {
        label: 'Filename'
      },
      length: {
        label: 'Length'
      },
      'metadata.detectedExt': {
        label: 'Detected Extension'
      },
      'metadata.detectedMime': {
        label: 'Detected MIME'
      },
      'metadata.kind': {
        label: 'Kind'
      },
      'metadata.orientation': {
        label: 'Orientation'
      },
      'metadata.sha256': {
        label: 'SHA-256'
      },
      'metadata.size': {
        label: 'Size'
      },
      [ADMIN_MEDIA_UPLOAD_DATE_PATH]: {
        label: 'Uploaded At'
      }
    },
    translations: {
      en: {
        labels: {
          [`media-${bucketName}`]: ADMIN_MEDIA_RESOURCE_LABEL_BY_BUCKET[bucketName]
        }
      }
    }
  }
})

export const ADMIN_MEDIA_OPTIONS = STREAM_MEDIA_BUCKET_NAMES.map(buildAdminMediaOptions)
