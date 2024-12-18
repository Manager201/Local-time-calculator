let videos = [];
let intervalId;

function addFiles() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click(); // Trigger the file input click event to open the file selection dialog
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files);

        files.forEach(file => {
            const videoObj = { name: file.name, duration: 0, playbackSpeed: 1 };
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
        
        // Add an input field for each video's custom playback speed
        listItem.innerHTML = `
            ${video.name} - ${formatTime(video.duration)} 
            <label>Playback Speed: 
                <input type="number" value="${video.playbackSpeed}" min="0.1" step="0.1" 
                    onchange="updatePlaybackSpeed(${index}, this.value)">
            </label>
            <button onclick="removeVideo(${index})">Remove</button>
        `;
        
        videoList.appendChild(listItem);
    });
}

function updatePlaybackSpeed(index, speed) {
    videos[index].playbackSpeed = parseFloat(speed) || 1;
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
        reducedDuration += video.duration / video.playbackSpeed;
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
