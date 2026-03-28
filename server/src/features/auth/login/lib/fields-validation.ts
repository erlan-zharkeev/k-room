import { requiredStringRule } from 'src/features/auth'

export const fieldsValidation = [requiredStringRule('email'), requiredStringRule('password')]
