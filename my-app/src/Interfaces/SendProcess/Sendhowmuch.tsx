import React, { useState, useEffect } from "react";
import "../Main.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMoney } from "../../redux/store";
import { getSpeech } from "../../getSpeech";

function Sendhowmuch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [selectedOption, setSelectedOption] = useState(null);
  const selectedOption = useSelector((state: any) => state.selectedOption);
  const money = useSelector((state: any) => state.money);
  const accountAmount = useSelector((state: any) => state.accountAmount);

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
    if (selectedOption === "전화번호") navigate("/Send1_3");
    else navigate("/Send2_2");
  };
  const handleToAfter = () => {
    if (money > accountAmount) {
      alert("잔액이 부족합니다.");
    } else if (money > 0) {
      // 선택된 옵션이 있을 때만 다음 페이지로 이동
      // navigate("/Sendpwd");
      navigate("/Warning");
    } else {
      alert("금액을 입력하거나 선택해주세요.");
    }
  };

  const [selectedClass, setSelectedClass] = useState("");
  const [afterbtnflash, setafterbtnflash] = useState("afterbtn");

  const handleOptionClick = (option: any) => {
    console.log(option);
    setSelectedClass("none");
    setafterbtnflash("afterbtn-flash");
    console.log(afterbtnflash);
    if (option === "전액") {
      dispatch(setMoney(accountAmount)); // 전액
      setSelectedClass("none");
    } else dispatch(setMoney(option)); // 선택한 금액
  };

  const handleDirectInputClick = () => {
    setSelectedClass("none");
    dispatch(setMoney(0));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (!isNaN(Number(inputValue))) {
      dispatch(setMoney(Number(inputValue)));
    } else {
      console.error("숫자만 입력해주세요");
    }
  };

  const isGuideTrue = useSelector((state: any) => state.isGuideTrue);
  useEffect(() => {
    console.log("SendFirst component mounted");
    if (isGuideTrue) {
      const fetchData = async () => {
        try {
          const remitCode = selectedOption === "계좌번호" ? "ACCOUNT" : "PHONE";
          const indexnum = selectedOption === "계좌번호" ? 5 : 6;
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
          금액을 선택해주세요.
        </div>
      </div>
      <div style={{ fontSize: "20px" }}>얼마를 보낼까요?</div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={money}
          onChange={handleInputChange}
          placeholder="금액"
          style={{ left: "20px", margin: "20px 0", width: "240px", height: "50px", fontSize: "30px" }}
        />
        <div style={{ marginTop: "30px", marginLeft: "10px", height: "50px", fontSize: "30px" }}>원</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          className={`amountButton ${money === 10000 ? "selected" : selectedClass}`}
          onClick={() => handleOptionClick(10000)}
        >
          1만
        </div>
        <div
          className={`amountButton ${money === 50000 ? "selected" : selectedClass}`}
          onClick={() => handleOptionClick(50000)}
        >
          5만
        </div>
        <div
          className={`amountButton ${money === 100000 ? "selected" : selectedClass}`}
          onClick={() => handleOptionClick(100000)}
        >
          10만
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          className={`amountButton ${money === 1000000 ? "selected" : selectedClass}`}
          onClick={() => handleOptionClick(1000000)}
        >
          100만
        </div>
        <div
          className={`amountButton ${money === accountAmount ? "selected" : selectedClass}`}
          onClick={() => handleOptionClick("전액")}
        >
          전액
        </div>
        <div className={`amountButton ${money === 0 ? "selected" : selectedClass}`} onClick={handleDirectInputClick}>
          직접 입력
        </div>
      </div>

      <div className="buttonContainer">
        <div className="beforebtn" onClick={handleToBefore}>
          &lt; 이전
        </div>
        <div className={afterbtnflash} onClick={handleToAfter}>
          보내기 &gt;
        </div>
      </div>
    </div>
  );
}

export default Sendhowmuch;
