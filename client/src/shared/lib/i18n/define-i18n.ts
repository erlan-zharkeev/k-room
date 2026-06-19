import { APP_LANGUAGE_VALUES, type AppLanguage } from 'global-shared'

export type I18nKey = string

export type I18nNamedValues = Record<string, unknown>

export interface ClientI18nFormatter {
  format: (...args: never[]) => string
  params: readonly string[]
}

interface ClientI18nMessageContext {
  named: (key: string) => unknown
}

type ClientI18nVueFormatter = (context: ClientI18nMessageContext) => string

export type ClientI18nMessageValue = string | ClientI18nVueFormatter | ClientI18nMessages

export interface ClientI18nMessages {
  [key: string]: ClientI18nMessageValue
}

export type ClientI18nLocaleMessages = Record<AppLanguage, ClientI18nMessages>

type ClientI18nSourceValue = string | ClientI18nFormatter

type ClientI18nSource = {
  readonly [key: string]: {
    readonly [Language in AppLanguage]: ClientI18nSourceValue
  }
}

type ClientI18nKeyMap<Namespace extends string, Source extends ClientI18nSource> = {
  readonly [Key in keyof Source]: `${Namespace}.${Extract<Key, string>}`
}

const messagesByResource = new WeakMap<object, ClientI18nLocaleMessages>()

const createEmptyMessages = (): ClientI18nLocaleMessages =>
  Object.fromEntries(APP_LANGUAGE_VALUES.map((language) => [language, {}])) as ClientI18nLocaleMessages

const isClientI18nFormatter = (value: ClientI18nSourceValue): value is ClientI18nFormatter =>
  typeof value === 'object' && 'format' in value && 'params' in value

const createVueI18nFormatter = ({ format, params }: ClientI18nFormatter): ClientI18nVueFormatter => {
  return (context) => format(...(params.map((param) => context.named(param)) as never[]))
}

const mergeMessageTree = (target: ClientI18nMessages, source: ClientI18nMessages) => {
  Object.entries(source).forEach(([key, value]) => {
    const currentValue = target[key]

    if (
      currentValue &&
      typeof currentValue === 'object' &&
      typeof value === 'object' &&
      !('format' in value) &&
      !Array.isArray(value)
    ) {
      mergeMessageTree(currentValue as ClientI18nMessages, value as ClientI18nMessages)
      return
    }

    target[key] = value
  })
}

const setMessage = (messages: ClientI18nMessages, path: string[], value: ClientI18nMessageValue) => {
  const [segment, ...restPath] = path

  if (!segment) return

  if (!restPath.length) {
    messages[segment] = value
    return
  }

  const currentValue = messages[segment]
  const nextMessages =
    currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue)
      ? (currentValue as ClientI18nMessages)
      : {}

  messages[segment] = nextMessages
  setMessage(nextMessages, restPath, value)
}

export const i18nFormatter = <const Params extends readonly string[], Formatter extends (...args: never[]) => string>(
  params: Params,
  format: Formatter
): ClientI18nFormatter => ({
  format,
  params
})

export const defineI18n = <const Namespace extends string, const Source extends ClientI18nSource>(
  namespace: Namespace,
  source: Source
) => {
  const keys: Record<string, string> = {}
  const messages = createEmptyMessages()
  const namespacePath = namespace.split('.')

  Object.entries(source).forEach(([key, value]) => {
    keys[key] = `${namespace}.${key}`

    APP_LANGUAGE_VALUES.forEach((language) => {
      const localizedValue = value[language]
      const messageValue = isClientI18nFormatter(localizedValue)
        ? createVueI18nFormatter(localizedValue)
        : localizedValue

      setMessage(messages[language], [...namespacePath, key], messageValue)
    })
  })

  messagesByResource.set(keys, messages)

  return keys as ClientI18nKeyMap<Namespace, Source>
}

export const buildI18nMessages = (resources: object[]): ClientI18nLocaleMessages => {
  const messages = createEmptyMessages()

  resources.forEach((resource) => {
    const resourceMessages = messagesByResource.get(resource)

    if (!resourceMessages) return

    APP_LANGUAGE_VALUES.forEach((language) => {
      mergeMessageTree(messages[language], resourceMessages[language])
    })
  })

  return messages
}
