import { ORIGINS } from 'shared-config'

export const corsOptions = {
  origin: ORIGINS,
  optionsSuccessStatus: 200,
  preflightContinue: true,
  credentials: true
}
