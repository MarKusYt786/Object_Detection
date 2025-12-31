const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let model;

navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err) => {
        console.error('Error accessing the camera: ', err);
    });

async function detectObjects() {
    if (!model) {
        model = await cocoSsd.load();
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const predictions = await model.detect(canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    predictions.forEach((prediction) => {
        context.beginPath();
        context.rect(...prediction.bbox);
        context.lineWidth = 2;
        context.strokeStyle = 'red';
        context.fillStyle = 'red';
        context.stroke();
        context.font = '16px Arial';
        context.fillText(
            `${prediction.class} - ${Math.round(prediction.score * 100)}%`,
            prediction.bbox[0],
            prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
        );
    });
    requestAnimationFrame(detectObjects);
}

video.addEventListener('play', () => {
    detectObjects();
});
