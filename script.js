let videos = [];
let intervalId;

function addFiles() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files);

        files.forEach(file => {
            const videoObj = { name: file.name, duration: 0, playbackSpeed: 0 };
            const videoElement = document.createElement('video');

            videoElement.src = URL.createObjectURL(file);
            videoElement.addEventListener('loadedmetadata', () => {
                videoObj.duration = videoElement.duration;
                videos.push(videoObj);
                updateVideoList();
                updateResults();
            });
        });
    });
});

function updateVideoList() {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';

    videos.forEach((video, index) => {
        const listItem = document.createElement('li');
        
        // Button for setting custom playback speed
        listItem.innerHTML = `
            ${video.name} - ${formatTime(video.duration)}
            <button onclick="setPlaybackSpeed(${index})">Set Speed</button>
            <button onclick="removeVideo(${index})">Remove</button>
        `;
        
        videoList.appendChild(listItem);
    });
}

function setPlaybackSpeed(index) {
    const speed = prompt("Enter playback speed (e.g., 1 for normal, 2 for double speed):", videos[index].playbackSpeed);
    videos[index].playbackSpeed = parseFloat(speed) || 0;  // Default to 0 if invalid input
    updateResults();
}

function removeVideo(index) {
    videos.splice(index, 1);
    updateVideoList();
    updateResults();
}

function updateResults() {
    let totalDuration = 0;
    let reducedDuration = 0;

    videos.forEach(video => {
        totalDuration += video.duration;
        reducedDuration += video.duration / (video.playbackSpeed || 1); // Default to 1 if speed is 0
    });

    const timeSaved = totalDuration - reducedDuration;

    document.getElementById('totalDuration').textContent = formatTime(totalDuration);
    document.getElementById('reducedDuration').textContent = formatTime(reducedDuration);
    document.getElementById('timeSaved').textContent = formatTime(timeSaved);
    updateFutureTime(reducedDuration);
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateFutureTime(duration) {
    clearInterval(intervalId);

    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + duration * 1000);

    displayFutureTime(futureTime);

    intervalId = setInterval(() => {
        futureTime.setSeconds(futureTime.getSeconds() + 1);
        displayFutureTime(futureTime);
    }, 1000);
}

function displayFutureTime(futureTime) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    document.getElementById('futureTime').textContent = futureTime.toLocaleString('en-US', options);
}
