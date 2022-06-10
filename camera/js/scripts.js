const accessCameraButton = document.querySelector('.open-camera-button');
const stopCameraButton = document.querySelector('.stop-camera-button');
const videoOutput =  document.querySelector('.camera-stream');
let track;

const openCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    const videoTracks = stream.getVideoTracks()
    track = videoTracks[0];
    console.log(videoTracks.map(track => track.label));
    console.log(`Getting video from: ${track.label}`)
    
    videoOutput.srcObject = stream;
    accessCameraButton.hidden = true;
    stopCameraButton.hidden = false;
    videoOutput.hidden = false;
};

const stopCamera = () => {
    track.stop();
    accessCameraButton.hidden = false;
    stopCameraButton.hidden  = true;
    videoOutput.hidden = true;
}

accessCameraButton.addEventListener('click', openCamera);
stopCameraButton.addEventListener('click', stopCamera);