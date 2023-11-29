import React, { useEffect, useState } from "react";
import "../Main.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOption } from "../../redux/store"; // setOption import 추가
import Phone from "../../imgs/phone.png";
import Account from "../../imgs/account.png";

function SendFirst() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [selectedOption, setSelectedOption] = useState(null);
  const selectedOption = useSelector((state: any) => state.selectedOption);
  const [voiceGuide, setVoiceGuide] = useState(""); // Added state for voiceGuide

  const handleToBefore = () => {
    navigate("/");
  };
  const handleToAfter = () => {
    if (selectedOption) {
      // 선택된 옵션이 있을 때만 다음 페이지로 이동
      console.log(selectedOption);
      navigate("/SendSecond");
    } else {
      // 선택된 옵션이 없으면 경고 메시지 또는 다른 처리를 수행
      alert("돈 보내실 방법을 선택해주세요.");
    }
  };

  const handleOptionClick = (option: any) => {
    dispatch(setOption(option));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const remitCode = selectedOption === "계좌번호" ? "ACCOUNT" : "PHONE";
        // console.log(remitCode);
        const response = await fetch("https://with-pet-be.org/api/voice/guide", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voiceCode: "REMIT",
            remitCode: "NOTDECIDE",
            index: 1,
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

    // Call the API when the component mounts
    fetchData();
  }, [selectedOption]); // Dependency array to ensure the API call is triggered when selectedOption changes

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="sub-title">
        돈 보내실 방법을
        <br />
        선택해주세요.
      </div>
      <div
        className={`send-box ${selectedOption === "전화번호" ? "selected" : ""}`}
        onClick={() => handleOptionClick("전화번호")}
        style={{ display: "flex" }}
      >
        <div className="btn-text" style={{ display: "flex" }}>
          <div style={{ marginRight: "20px", paddingTop: "12px" }}>
            전화번호로
            <br />돈 보내기
          </div>
          <img src={Phone} width={"100px"} />
        </div>
        {/* <img src="" /> */}
      </div>
      <div
        className={`send-box ${selectedOption === "계좌번호" ? "selected" : ""}`}
        onClick={() => handleOptionClick("계좌번호")}
      >
        <div className="btn-text" style={{ display: "flex" }}>
          <div style={{ marginRight: "20px", paddingTop: "12px" }}>
            계좌번호로 <br />돈 보내기
          </div>
          <img src={Account} width={"100px"} />
        </div>
      </div>
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

export default SendFirst;
