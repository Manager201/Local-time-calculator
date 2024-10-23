let videos = [];

function addFiles() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click(); // Programmatically trigger the file input click event
}

document.getElementById('fileInput').addEventListener('change', () => {
    const fileInput = document.getElementById('fileInput');
    const files = Array.from(fileInput.files);

    files.forEach(file => {
        const videoObj = { name: file.name, duration: 0 };
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

function updateVideoList() {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';

    videos.forEach((video, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${video.name} - ${formatTime(video.duration)} 
            <button onclick="removeVideo(${index})">Remove</button>
        `;
        videoList.appendChild(listItem);
    });
}

function removeVideo(index) {
    videos.splice(index, 1);
    updateVideoList();
    updateResults();
}

function updateResults() {
    const totalDuration = videos.reduce((sum, video) => sum + video.duration, 0);
    const playbackSpeed = parseFloat(document.getElementById('playbackSpeed').value) || 1;
    const reducedDuration = totalDuration / playbackSpeed;
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
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + duration * 1000);
    
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

document.getElementById('playbackSpeed').addEventListener('input', updateResults);
