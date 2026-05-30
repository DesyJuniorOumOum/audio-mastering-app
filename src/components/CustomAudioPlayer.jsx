// src/components/CustomAudioPlayer.jsx
import { useState, useEffect, useRef } from 'react';
import WaveformVisualizer from './WaveformVisualizer';

export default function CustomAudioPlayer({ src }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef(null);
    const savedTimeRef = useRef(0);
    const wasPlayingRef = useRef(false);

    // Swap logique avec préservation de la timeline
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Sauvegarder la position et l'état de lecture actuels
        savedTimeRef.current = audio.currentTime;
        wasPlayingRef.current = !audio.paused;

        // Charger le nouvel URL
        audio.src = src;
        audio.load();
    }, [src]);

    // Déclenché quand le nouveau src a chargé ses metadata
    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (!audio) return;

        setDuration(audio.duration || 0);
        
        // Restaurer précisément le minutage
        audio.currentTime = savedTimeRef.current;

        // Reprendre la lecture si nécessaire
        if (wasPlayingRef.current) {
            audio.play().catch(err => console.log("Play blocked on swap:", err));
            setIsPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(err => console.log("Play failed:", err));
            setIsPlaying(true);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const handleVolumeChange = (e) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        setIsMuted(vol === 0);
        if (audioRef.current) {
            audioRef.current.volume = vol;
            audioRef.current.muted = vol === 0;
        }
    };

    const toggleMute = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (audioRef.current) {
            audioRef.current.muted = nextMute;
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="custom-audio-player">
            <audio
                ref={audioRef}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                style={{ display: 'none' }}
            />

            {/* Visualisation Waveform */}
            <WaveformVisualizer isPlaying={isPlaying} />

            <div className="player-controls-row">
                {/* Play / Pause */}
                <button className="player-btn-play" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? (
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <rect x="5" y="4" width="4" height="16" rx="1" />
                            <rect x="15" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M7 4v16l12-8z" />
                        </svg>
                    )}
                </button>

                {/* Progress bar */}
                <div className="player-progress-container">
                    <input 
                        type="range"
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        value={currentTime}
                        onChange={handleSeek}
                        className="player-slider"
                        style={{
                            background: `linear-gradient(to right, var(--secondary) 0%, var(--secondary) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.1) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.1) 100%)`
                        }}
                    />
                    <div className="player-time-row">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume slider */}
                <div className="player-volume-container">
                    <button className="player-btn-volume" onClick={toggleMute} aria-label="Mute">
                        {isMuted ? (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.03c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                        ) : volume < 0.4 ? (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M7 9v6h4l5 5V4l-5 5H7zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                        )}
                    </button>
                    <input 
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="player-volume-slider"
                        style={{
                            background: `linear-gradient(to right, #fff 0%, #fff ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) 100%)`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
