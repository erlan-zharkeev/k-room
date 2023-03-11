import { useEffect } from 'react'
import AudioVisualiser, { MediaStreamProvider, useMediaStream } from 'react-mic-waver'

const TechSettingsPopup = () => {
  const { stream, start, stop } = useMediaStream()
  console.log(stream)
  // const toggleMic = () => (stream ? stop() : start())
  useEffect(() => {})
  return (
    <div className="tech-settings-popup">
      {/* <MediaStreamProvider video={false} audio={true}>
        <div style={{ width: '300px', height: '200px', background: '#fff' }}>
          <button className="App-btn" onClick={toggleMic}>
            {stream ? 'Close Microphone' : 'Open Microphone'}
          </button>
          <AudioVisualiser stream={stream} onRender={() => console.log('Render!')} style={{ background: 'red' }} />
        </div>
      </MediaStreamProvider> */}
      {/* <AudioVisualiser stream={stream} onRender={() => console.log('Render!')} style={{ background: 'red' }} /> */}
    </div>
  )
}

export default TechSettingsPopup
