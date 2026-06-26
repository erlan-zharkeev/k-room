import React from 'react'
import { Box, Button, Text, ValueGroup } from '@adminjs/design-system'

const PREVIEW_CONTAINER_STYLE = {
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 8,
  display: 'flex',
  justifyContent: 'center',
  minHeight: 220,
  overflow: 'hidden'
}

const IMAGE_STYLE = {
  display: 'block',
  maxHeight: 520,
  maxWidth: '100%',
  objectFit: 'contain'
}

const MEDIA_STYLE = {
  display: 'block',
  maxHeight: 520,
  width: '100%'
}

const PDF_STYLE = {
  border: 0,
  display: 'block',
  height: 720,
  width: '100%'
}

const getRecordValue = (record, path) => String(record?.params?.[path] ?? '').toLowerCase()

const getAdminRootPath = () => {
  const rootPath = globalThis.AdminJS?.env?.ADMIN_ROOT_PATH

  if (rootPath) {
    return String(rootPath).replace(/\/+$/, '')
  }

  return globalThis.location.pathname.split('/resources/')[0].replace(/\/+$/, '')
}

const buildPreviewUrl = (record, property) => {
  const previewBasePath = String(property.custom?.previewBasePath ?? '').replace(/^\/?/, '/')
  const fileId = encodeURIComponent(String(record.params._id ?? record.id))

  return `${getAdminRootPath()}${previewBasePath}/${fileId}`
}

const isImage = (kind, contentType) => kind === 'image' || contentType.startsWith('image/')
const isVideo = (kind, contentType) => kind === 'video' || contentType.startsWith('video/')
const isAudio = (kind, contentType) => kind === 'audio' || contentType.startsWith('audio/')
const isPdf = (kind, contentType) => kind === 'pdf' || contentType === 'application/pdf'

const renderPreview = ({ contentType, filename, kind, sourceUrl }) => {
  if (isImage(kind, contentType)) {
    return <img alt={filename} src={sourceUrl} style={IMAGE_STYLE} />
  }

  if (isVideo(kind, contentType)) {
    return <video controls playsInline preload="metadata" src={sourceUrl} style={MEDIA_STYLE} />
  }

  if (isAudio(kind, contentType)) {
    return <audio controls preload="metadata" src={sourceUrl} style={MEDIA_STYLE} />
  }

  if (isPdf(kind, contentType)) {
    return <iframe src={sourceUrl} style={PDF_STYLE} title={filename} />
  }

  return (
    <Box p="xl" textAlign="center">
      <Text>Preview is available for images, videos, audio files, and PDFs.</Text>
    </Box>
  )
}

const AdminMediaPreview = ({ property, record }) => {
  if (!record?.id) {
    return null
  }

  const sourceUrl = String(record.params.previewUrl ?? buildPreviewUrl(record, property))
  const downloadUrl = String(record.params.downloadUrl ?? `${sourceUrl}?download=1`)
  const filename = String(record.params.filename ?? record.id)
  const kind = getRecordValue(record, 'metadata.kind')
  const contentType = getRecordValue(record, 'contentType')

  return (
    <ValueGroup label={property.label}>
      <Box>
        <Box style={PREVIEW_CONTAINER_STYLE}>{renderPreview({ contentType, filename, kind, sourceUrl })}</Box>
        <Box display="flex" flexWrap="wrap" gap="default" mt="default">
          <Button as="a" href={sourceUrl} rel="noreferrer" size="sm" target="_blank">
            Open
          </Button>
          <Button as="a" href={downloadUrl} size="sm" variant="outlined">
            Download
          </Button>
        </Box>
      </Box>
    </ValueGroup>
  )
}

export default AdminMediaPreview
