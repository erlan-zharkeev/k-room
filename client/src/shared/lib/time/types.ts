export type DateTimeFormatType = 'auto' | 'dmy-dot-24h' | 'mdy-slash-12h' | 'dmy-slash-24h' | 'ymd-dash-24h'

export type DateTimeFormatPatternMapType = Partial<Record<DateTimeFormatType, string>>
