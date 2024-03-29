import React, { useState, useEffect } from "react";
import { getSpeech } from "./getSpeech";

function TTS() {
  const [value, setValue] = useState("안녕하세요");

  //음성 변환 목소리 preload
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const handleInput = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setValue(value);
  };

  const handleButton = () => {
    getSpeech(value);
  };

  return (
    <div className="App">
      <div></div>
      {/* <h1 style={{ paddingTop: "30px", marginBottom: "20px" }}>TTS(한국어)</h1> */}
      {/* <p>텍스트를 음성으로</p> */}
      <div className="box">
        <input onChange={handleInput} value={value} />
        <button onClick={handleButton}>음성 변환</button>
      </div>
    </div>
  );
}

export default TTS;
