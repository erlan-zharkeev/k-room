import { requiredStringRule } from 'src/features/auth'

export const fieldsValidation = [requiredStringRule('codeToValidate'), requiredStringRule('password')]
