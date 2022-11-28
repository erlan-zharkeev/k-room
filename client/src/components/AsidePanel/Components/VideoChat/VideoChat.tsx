export const VideoChat = () => {
  // const getUserMedia = async () => await navigator.mediaDevices.getUserMedia({ video: true, audio: false })

  // const setUserVideo = async (instance: HTMLVideoElement) => {
  //   if (!instance) return
  //   instance.srcObject = await getUserMedia()
  // }

  return (
    <div className="video-chat">
      {/* <video
        autoPlay
        className="video-chat__user-video"
        ref={async (instance: HTMLVideoElement) => await setUserVideo(instance)}
      ></video>
      <video
        autoPlay
        className="video-chat__guest-video"
        ref={async (instance: HTMLVideoElement) => await setUserVideo(instance)}
      ></video> */}
    </div>
  )
}
export default VideoChat
