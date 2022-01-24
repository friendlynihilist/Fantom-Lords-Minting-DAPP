import React, { useState, useRef } from "react";
import tune from './assets/fantomLords.mp3'

function MusicCard() {
  const [playing, setPlaying] = useState(false);

  const url = tune;

  const audioRef = useRef(new Audio(url));

  const play = () => {
    setPlaying(true);
    audioRef.current.play();
  };

  const pause = () => {
    setPlaying(false);
    audioRef.current.pause();
  };

  return (
    <div className="music-card">
      <div className="music-card_image-con">
        <button
        //   style={{
        //     backgroundImage: `url(${process.env.PUBLIC_URL}music-image.jpg)`,
        //   }}
          onClick={playing ? pause : play}
        >
          {playing ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className="music-card_info-con">
        <div className="music-card_info-name">
          <h3>music name</h3>
          <p> - </p>
          <p>Singer</p>
        </div>
        <div className="music-card_info-seekbar">
          <input
            type="range"
            style={{
              width: "100%",
            }}
          />
        </div>
      </div>
      <button className="music-card_actions-btn">
        <FaEllipsisV />
      </button>
    </div>
  );
}

export default MusicCard;