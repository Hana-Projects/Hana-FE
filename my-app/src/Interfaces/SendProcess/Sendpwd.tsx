import React, { useEffect, useState } from "react";
import "../Main.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setReceiver } from "../../redux/store";
import { setReceiveAccount } from "../../redux/store";
import { setMoney } from "../../redux/store";
import Hanaicon from "../../imgs/hana_icon.jpeg";
import Delete from "../../imgs/delete_icon.png";
import { getSpeech } from "../../getSpeech";

function Sendpwd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [selectedOption, setSelectedOption] = useState(null);
  const money = useSelector((state: any) => state.money);
  const receiveAccount = useSelector((state: any) => state.receiveAccount);
  const receiver = useSelector((state: any) => state.receiver);
  const [password, setPassword] = useState(""); // 비밀번호 상태 추가

  const [voiceGuide, setVoiceGuide] = useState("");

  useEffect(() => {
    window.speechSynthesis.getVoices();
    console.log("getvoices");
  }, []);

  useEffect(() => {
    getSpeech(voiceGuide);
    console.log("speech");
  }, [voiceGuide]);

  const handleToBefore = () => {
    navigate("/Warning");
  };
  const handleToAfter = () => {
    if (password.length === 4) {
      navigate("/SendFinal");
    } else {
      alert("비밀번호는 4자리 입니다.");
    }
  };
  const handleKeypadClick = (number: number) => {
    if (password.length < 4) {
      if (number > -1) {
        setPassword((prevPassword) => prevPassword + number.toString());
      }
    }
  };

  const handleDeleteClick = () => {
    setPassword((prevPassword) => prevPassword.slice(0, -1));
  };

  const renderPasswordCircles = () => {
    console.log("pwd circles"); // 안됨
    const circles = [];

    for (let i = 0; i < 4; i++) {
      circles.push(<div key={i} className={`password-circle ${i < password.length ? "filled" : ""}`}></div>);
    }

    return circles;
  };

  const selectedOption = useSelector((state: any) => state.selectedOption);

  const isGuideTrue = useSelector((state: any) => state.isGuideTrue);
  useEffect(() => {
    console.log("SendFirst component mounted");
    if (isGuideTrue) {
      const fetchData = async () => {
        try {
          const remitCode = selectedOption === "계좌번호" ? "ACCOUNT" : "PHONE";
          const indexnum = selectedOption === "계좌번호" ? 7 : 8;
          console.log(remitCode);
          const response = await fetch("https://with-pet-be.org/api/voice/guide", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              voiceCode: "REMIT",
              remitCode: remitCode,
              index: indexnum,
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
    }
  }, [selectedOption]); // Dependency array to ensure the API call is triggered when selectedOption changes

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="sub-title">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "80px",
            width: "390px",
            background: "rgba(0, 132, 133, 0.10)",
          }}
        >
          계좌 비밀번호를
          <br />
          입력해주세요.
        </div>
      </div>
      <div style={{ fontSize: "20px" }}>
        <span>
          {receiveAccount}은행 {receiver}
        </span>
        님께 <br />
        <span>{money}원</span>을 이체합니다.
      </div>
      <div>
        <br />
        비밀번호 입력
      </div>
      <div style={{ marginTop: "5px", marginBottom: "20px" }}>
        {/* 비밀번호 입력창 */}
        <input
          type="password"
          value={password}
          readOnly
          style={{ width: "200px", height: "24px", fontSize: "30px", textAlign: "center" }}
        />
        {/* <div style={{ marginTop: "5px", marginBottom: "20px", display: "flex" }}>
          
          {renderPasswordCircles()}
        </div> */}
      </div>
      <div>
        {/* 키패드 생성 */}
        <div>
          {[1, 2, -1, 3].map((number) => (
            <button key={number} className="sendpwd-button" onClick={() => handleKeypadClick(number)}>
              {number === -1 ? <img src={Hanaicon} alt="Hana" className="keypad-image" /> : number}
            </button>
          ))}
        </div>
        <div>
          {[4, 5, -1, 6].map((number) => (
            <button key={number} className="sendpwd-button" onClick={() => handleKeypadClick(number)}>
              {number === -1 ? <img src={Hanaicon} alt="Hana" className="keypad-image" /> : number}
            </button>
          ))}
        </div>
        <div>
          {[7, 8, 9, 0].map((number) => (
            <button key={number} className="sendpwd-button" onClick={() => handleKeypadClick(number)}>
              {number}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "26px" }} onClick={handleDeleteClick}>
          <img src={Delete} height={"40px"} alt="Delete icon" />
        </div>
      </div>

      <div className="buttonContainer">
        <div className="beforebtn" onClick={handleToBefore}>
          &lt; 이전
        </div>
        <div className="afterbtn" onClick={handleToAfter}>
          확인 &gt;
        </div>
      </div>
    </div>
  );
}

export default Sendpwd;
