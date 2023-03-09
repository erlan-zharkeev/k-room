import ErrorBucketProps from './@types'

export const ErrorBucket = ({ errors }: ErrorBucketProps) => {
  return (
    errors.length > 0 && (
      <div className="error-bucket">
        {errors &&
          errors.map((error: string) => (
            <p className="error-bucket__el">
              <span>{error}</span>
            </p>
          ))}
      </div>
    )
  )
}

export default ErrorBucket
