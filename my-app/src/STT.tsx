import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { getSpeech } from "./getSpeech"; // Import the text-to-speech function
import { setIsGuideTrue } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";

const STT: React.FC = () => {
  const dispatch = useDispatch();
  const isGuideTrue = useSelector((state: any) => state.isGuideTrue);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [scrollState, setScrollState] = useState(0);
  const [guide, setGuide] = useState("");

  const word = transcript.split(" ");
  useEffect(() => {
    setGuide("");
  }, []);

  const checking = async () => {
    try {
      // setGuide("");
      console.log("인식된 문장 : ", word[word.length - 1]);
      const response = await fetch("https://with-pet-be.org/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userVoice: word[word.length - 1],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);

        // Update state with the received guide value
        setGuide(result.data.guide);
        console.log(result.data.guide);
        dispatch(setIsGuideTrue());
      } else {
        console.error("API Error:", response.statusText);
      }
    } catch (error) {
      console.error("API Error:");
    }
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
    console.log("getvoices");
  }, []);

  useEffect(() => {
    if (browserSupportsSpeechRecognition) checking();
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>브라우저가 음성 인식을 지원하지 않습니다.</span>;
  }

  const stopandspeech = () => {
    SpeechRecognition.stopListening();
    getSpeech(guide);
    console.log("speech main");
  };

  return (
    <div>
      <div style={{ display: "flex", marginLeft: "80px" }}>
        <p style={{ fontSize: "10px", marginRight: "10px" }}>마이크 상태: {listening ? "켜짐" : "꺼짐"}</p>

        <button
          onClick={() => SpeechRecognition.startListening({ continuous: true, language: "ko" })}
          style={{ marginRight: "5px" }}
        >
          말하기
        </button>
        <button onClick={stopandspeech}>멈추기</button>
      </div>
      {/* <p>인식된 문장 : {transcript}</p> */}
      {/* <p>가이드 값: {guide}</p> */}
    </div>
  );
};

export default STT;
