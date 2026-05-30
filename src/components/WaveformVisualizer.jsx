// src/components/WaveformVisualizer.jsx
export default function WaveformVisualizer({ isPlaying }) {
    return (
        <div className="player-waveform-decor">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((bar, i) => {
                const randomHeight = [12, 28, 40, 20, 32, 45, 18, 25, 38, 50, 42, 22, 35, 14, 28, 44, 20, 30, 16, 25][i % 20];
                const animDelay = (i * 0.08).toFixed(2);
                return (
                    <span 
                        key={i} 
                        className={`player-wave-bar ${isPlaying ? 'playing' : ''}`} 
                        style={{ 
                            height: `${randomHeight}px`,
                            animationDelay: `${animDelay}s` 
                        }}
                    />
                );
            })}
        </div>
    );
}
