// spotifyPlayer.js

export const initializeSpotifyPlayer = (token) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
        player = new Spotify.Player({
            name: 'Web Playback SDK Player',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5,
            robustnessLevel: 'HW_SECURE_ALL' // Specify robustness level here
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => console.error(message));
        player.addListener('authentication_error', ({ message }) => console.error(message));
        player.addListener('account_error', ({ message }) => console.error(message));
        player.addListener('playback_error', ({ message }) => console.error(message));

        player.addListener('player_state_changed', state => {
            console.log(state);
            if (state) {
                const currentTrack = state.track_window.current_track;

                // Update current track index
                currentTrackIndex = state.track_window.current_track.index;

                // Update current queue
                currentQueue = state.track_window.track_ids; // Track IDs of the current queue

                document.getElementById("track-name").innerText = currentTrack.name;
                document.getElementById("artist-name").innerText = currentTrack.artists[0].name;
                document.getElementById("album-cover").src = currentTrack.album.images[0].url;

                const currentPosition = state.position / 1000; // Convert to seconds
                const duration = state.duration / 1000; // Convert to seconds
                document.getElementById("progress").value = currentPosition;
                document.getElementById("progress").max = duration;

                document.getElementById("current-time").innerText = formatTime(currentPosition);
                document.getElementById("total-time").innerText = formatTime(duration);

                // Update play/pause button based on playback state
                const playBtn = document.getElementById("play-btn");
                const pauseBtn = document.getElementById("pause-btn");
                if (state.paused) {
                    playBtn.style.display = "block";
                    pauseBtn.style.display = "none";
                    clearInterval(progressInterval); // Stop the progress updates
                } else {
                    playBtn.style.display = "none";
                    pauseBtn.style.display = "block";
                    // Start updating the progress bar
                    startProgressInterval();
                }
            }
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            transferPlaybackHere(device_id);
        });

        // Connect to the player!
        player.connect();

        // Add event listeners for player controls
        document.getElementById("play-btn").addEventListener("click", () => {
            if (player) {
                player.resume().then(() => {
                    console.log('Playback resumed');
                    document.getElementById("play-btn").style.display = "none";
                    document.getElementById("pause-btn").style.display = "block";
                    startProgressInterval(); // Start updating the progress bar
                });
            }
        });

        document.getElementById("pause-btn").addEventListener("click", () => {
            if (player) {
                player.pause().then(() => {
                    console.log('Playback paused');
                    document.getElementById("pause-btn").style.display = "none";
                    document.getElementById("play-btn").style.display = "block";
                    clearInterval(progressInterval); // Stop the progress updates
                });
            }
        });

        document.getElementById("prev-btn").addEventListener("click", () => {
            if (player && currentQueue.length > 0) {
                // Move to previous track
                currentTrackIndex = (currentTrackIndex - 1 + currentQueue.length) % currentQueue.length; // Wrap around to end if necessary
                playCurrentTrack(); // Function to play the track at the current index
            }
        });

        document.getElementById("next-btn").addEventListener("click", () => {
            if (player && currentQueue.length > 0) {
                // Move to next track
                currentTrackIndex = (currentTrackIndex + 1) % currentQueue.length; // Wrap around to start if necessary
                playCurrentTrack(); // Function to play the track at the current index
            }
        });

        // Function to play the track at the current index
        function playCurrentTrack() {
            const trackUri = currentQueue[currentTrackIndex];
            if (trackUri) {
                player._options.getOAuthToken(access_token => {
                    fetch(`https://api.spotify.com/v1/me/player/play`, {
                        method: 'PUT',
                        body: JSON.stringify({ uris: [trackUri] }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${access_token}`
                        },
                    }).then(() => {
                        console.log(`Playing track ${trackUri}`);
                    }).catch(err => console.error("Error playing track:", err));
                });
            }
        }

        // Progress bar control
        document.getElementById("progress").addEventListener("input", function () {
            const newPosition = this.value;
            if (player) {
                player.seek(newPosition * 1000); // Convert to milliseconds
            }
        });
    };

    // Function to start updating the progress bar
    function startProgressInterval() {
        progressInterval = setInterval(() => {
            player.getCurrentState().then(state => {
                if (state) {
                    const currentPosition = state.position / 1000; // Convert to seconds
                    const duration = state.duration / 1000; // Convert to seconds
                    document.getElementById("progress").value = currentPosition;
                    document.getElementById("current-time").innerText = formatTime(currentPosition);
                    document.getElementById("total-time").innerText = formatTime(duration);
                }
            });
        }, 1000); // Update every second
    }

    // Transfer playback to the Web SDK device
    function transferPlaybackHere(device_id) {
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "device_ids": [device_id],
                "play": true // Set to true to start playback on transfer
            })
        });
    }

    // Function to format time in mm:ss format
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
};
