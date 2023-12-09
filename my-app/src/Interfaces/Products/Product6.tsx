import React, { useEffect, useState } from "react";
import "../Main.css";
import { useNavigate } from "react-router-dom";
import Hanagirl from "../../imgs/hanaGirl.png";
import Hanaboy from "../../imgs/hanaBoy.png";
import "./product_style.css";
import p4 from "../../imgs/p4.png";
import { useSelector } from "react-redux";
import { getSpeech } from "../../getSpeech";

function Product6() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");

  const handleToBefore = () => {
    navigate("/ProductSecond");
  };
  const handleToAfter = () => {
    setSelectedClass("selected");
    navigate("/Product7");
  };

  const handleLink = (url: string) => {
    window.location.href = url;
  };

  const [voiceGuide, setVoiceGuide] = useState("");
  const isGuideTrue = useSelector((state: any) => state.isGuideTrue);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    console.log("getvoices");
  }, []);

  useEffect(() => {
    getSpeech(voiceGuide);
    console.log("speech");
  }, [voiceGuide]);

  useEffect(() => {
    console.log("SendFirst component mounted");
    if (isGuideTrue) {
      const fetchData = async () => {
        try {
          const response = await fetch("https://with-pet-be.org/api/voice/guide", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              voiceCode: "ITEM",
              remitCode: "NOTDECIDE",
              index: 6,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log("API Response:", result);

            setVoiceGuide(result.data.guide);
          } else {
            console.error("API Error:", response.statusText);
          }
        } catch (error) {
          console.error("API Error");
        }
      };

      fetchData();
    }
  }, []);

  return (
    <div>
      <div style={{ paddingTop: "50px", fontSize: "35px" }}>집 구매하는 것에</div>
      <div style={{ paddingTop: "10px", fontSize: "35px" }}>도움이 될 수 있는</div>
      <div style={{ paddingTop: "10px", fontSize: "35px", marginBottom: "30px" }}> 상품을 추천해드릴게요.</div>
      <img src={p4} width={"100px"} />
      <div
        className="products"
        onClick={() => handleLink("https://www.kebhana.com/cont/mall/mall08/mall0801/mall080102/1419695_115157.jsp")}
      >
        주택청약종합저축
      </div>
      <div
        className="products"
        onClick={() => handleLink("https://www.kebhana.com/cont/mall/mall08/mall0801/mall080102/1450446_115157.jsp")}
      >
        내집마련 더블업적금
      </div>
      <div
        className="products"
        onClick={() =>
          handleLink("https://www.kebhana.com/cont/mall/mall08/mall0802/mall080203/1489881_115198.jsp?_menuNo=98786")
        }
      >
        주거안정 주택구입자금대출
      </div>
      <div className="counseling">상담하기</div>
      <div style={{ height: "80px" }}></div> {/* 스크롤 마진 영역 */}
      <div className="buttonContainer">
        <div className="beforebtn" onClick={handleToBefore}>
          &lt; 이전
        </div>
        <div className="afterbtn" onClick={handleToAfter}>
          다음 &gt;
        </div>
      </div>
    </div>
  );
}

export default Product6;
