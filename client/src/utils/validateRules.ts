import { Rule } from 'antd/lib/form'
interface ValidateRules {
  [key: string]: Rule[]
}

const validateRules: ValidateRules = {
  required: [{ required: true, message: 'Field is required' }],
  emailCode: [
    { required: true, message: 'Field is required' },
    { len: 4, message: 'Field must contain 4 symbols' }
  ],
  email: [
    {
      validator: async (_: unknown, value: string) => {
        let error = ''
        if (!value) error = 'Email is required'
        else if (value.match(/[\s]/) != null) value.replace(/\s/g, '')
        else if (value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) == null)
          error = 'Please type correct email'
        return error ? await Promise.reject(error) : await Promise.resolve()
      }
    }
  ],
  password: [
    {
      validator: async (_: unknown, value: string) => {
        let error = ''
        if (!value) error = 'Password is required'
        else if (value.match(/[a-zA-Z]+/) == null) error = 'Password must consist only of Latin letters'
        else if (value.match(/([a-z][A-Z])|([A-Z][a-z])/) == null) error = 'Password must consist capital letter'
        else if (value.match(/[0-9\\.,:]/) == null) error = 'Password must contain numbers'
        else if (value.length < 6) error = 'Password must consist of at least 6 characters'
        return error ? await Promise.reject(error) : await Promise.resolve()
      }
    }
  ],
  policy: [
    {
      validator: async (_: unknown, value: string) => {
        let error = ''
        if (!value) error = 'Field is required'
        return error ? await Promise.reject(error) : await Promise.resolve()
      }
    }
  ]
}

export default validateRules
