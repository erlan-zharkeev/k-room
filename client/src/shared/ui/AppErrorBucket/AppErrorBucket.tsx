import './style.scss'
import type { IErrorBucketProps } from 'src/shared/ui/AppErrorBucket/config'

export const AppErrorBucket = ({ errors }: IErrorBucketProps) => {
  return (
    <div className="app-error-bucket">
      {errors &&
        errors.map((error: string) => (
          <p className="app-error-bucket__el" key={error}>
            <span>{error}</span>
          </p>
        ))}
    </div>
  )
}
