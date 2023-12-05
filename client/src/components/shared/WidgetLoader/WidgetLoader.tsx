export const WidgetLoader = ({ hide }: { hide: boolean }) => {
  const modifier = hide ? 'hide' : 'show'
  return (
    <div className={`widget-loader widget-loader--${modifier}`}>
      <div className="loading-container">
        <div className="loading-text">
          <span>L</span>
          <span>O</span>
          <span>A</span>
          <span>D</span>
          <span>I</span>
          <span>N</span>
          <span>G</span>
        </div>
      </div>
    </div>
  )
}
