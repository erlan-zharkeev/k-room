import './style.scss'
export interface ErrorBucketProps {
  errors: Array<string>
}

export const ErrorBucket = ({ errors }: ErrorBucketProps) => {
  return (
    <div className="error-bucket">
      {errors &&
        errors.map((error: string) => (
          <p className="error-bucket__el" key={error}>
            <span>{error}</span>
          </p>
        ))}
    </div>
  )
}
