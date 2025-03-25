import './style.scss'
export interface ErrorBucketProps {
  errors: Array<string>
}

export const AppErrorBucket = ({ errors }: ErrorBucketProps) => {
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
