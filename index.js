const video = document.getElementById("video")

// run calls in asynchronous
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
])

function AI() {
    navigator.getUserMedia(
        {
            video: {},
        },
        stream => video.srcObject = stream,
        err => console.error(err)
    );
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const display = {
        width: video.width,
        height: video.height
    }
    faceapi.matchDimensions(canvas, display);
    setInterval(async () => {
        let detection = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detection, display);
        if (resizedDetections.length > 0 && resizedDetections[0].expressions.happy > 0.8) {
            setTimeout(window.location.replace('lost.html'), 3000);
        }
    }, 100)
})

AI()