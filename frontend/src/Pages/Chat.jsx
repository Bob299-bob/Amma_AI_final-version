import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Chat() {
  const navigate = useNavigate();

  // --------------------------------
  // States
  // --------------------------------

  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [text, setText] = useState("");

  const recognitionRef = useRef(null);

  // --------------------------------
  // Speech Recognition Setup
  // --------------------------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    // Auto mode ke liye Hindi/Hinglish speech recognition
    recognition.lang = "hi-IN";

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      console.log("User said:", transcript);

      if (!transcript) {
        return;
      }

      setText(transcript);

      sendMessage(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  // --------------------------------
  // Start Listening
  // --------------------------------

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Aapka browser Speech Recognition support nahi karta."
      );
      return;
    }

    if (thinking || listening) {
      return;
    }

    try {
      // Auto speech recognition
      recognitionRef.current.lang = "hi-IN";

      recognitionRef.current.start();
    } catch (error) {
      console.log("Recognition error:", error);
    }
  };

  // --------------------------------
  // Stop Speaking
  // --------------------------------

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  };

  // --------------------------------
  // Clean Text For Speech
  // --------------------------------

  const cleanTextForSpeech = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/#{1,6}\s?/g, "")
      .replace(/`{1,3}/g, "")
      .replace(/[_~]/g, "")
      .replace(/[-•]\s/g, "")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // --------------------------------
  // Speak Response
  // --------------------------------

  const speak = (message) => {
    if (!window.speechSynthesis) {
      return;
    }

    stopSpeaking();

    const cleanMessage =
      cleanTextForSpeech(message);

    const speech =
      new SpeechSynthesisUtterance(cleanMessage);

    // Hindi script hai to Hindi voice
    // otherwise English voice
    const hindiPattern =
      /[\u0900-\u097F]/;

    if (hindiPattern.test(cleanMessage)) {
      speech.lang = "hi-IN";
    } else {
      speech.lang = "en-IN";
    }

    speech.rate = 0.9;
    speech.pitch = 1;

    speech.onstart = () => {
      setSpeaking(true);
    };

    speech.onend = () => {
      setSpeaking(false);
    };

    speech.onerror = (event) => {
      console.error(
        "Speech synthesis error:",
        event
      );

      setSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  // --------------------------------
  // Send Message
  // --------------------------------

  const sendMessage = async (
    messageText = text
  ) => {
    if (!messageText?.trim()) {
      return;
    }

    const cleanMessage =
      messageText.trim();

    // User message
    const userMessage = {
      role: "user",
      content: cleanMessage,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setText("");
    setThinking(true);

    try {
      console.log(
        "Sending:",
        cleanMessage
      );

      console.log(
        "Language: auto"
      );

      const response = await API.post(
        "/api/chat/",
        {
          message: cleanMessage,

          // Always Auto
          language: "auto",
        }
      );

      console.log(
        "Backend response:",
        response.data
      );

      const reply =
        response?.data?.reply ||
        "Sorry Amma, mujhe abhi response nahi mila.";

      // AI message
      const aiMessage = {
        role: "assistant",
        content: reply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      // Voice response
      speak(reply);

    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      const errorMessage = {
        role: "assistant",
        content:
          "Sorry Amma, abhi mujhse connection nahi ho pa raha hai.",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

    } finally {
      setThinking(false);
    }
  };

  // --------------------------------
  // Enter Key
  // --------------------------------

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      if (!thinking) {
        sendMessage();
      }
    }
  };

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="jarvis-page">

      {/* Header */}

      <div className="jarvis-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <div>
          <h1>🤖 Ammaa AI</h1>
          <p>Personal Voice Assistant</p>
        </div>

      </div>


      {/* AI Circle */}

      <div className="jarvis-main">

        <div
          className={`jarvis-orb ${
            listening
              ? "orb-listening"
              : thinking
              ? "orb-thinking"
              : speaking
              ? "orb-speaking"
              : ""
          }`}
        >
          🤖
        </div>


        <h2>
          {listening
            ? "Sun raha hoon..."
            : thinking
            ? "Soch raha hoon..."
            : speaking
            ? "Bol raha hoon..."
            : "Namaste Amma ❤️"}
        </h2>


        <p className="jarvis-status">

          {listening
            ? "Boliye Amma..."
            : thinking
            ? "Ek second..."
            : speaking
            ? "Suniyega Amma..."
            : "Baat karne ke liye microphone dabayein"}

        </p>


        {/* Microphone */}

        <button
          className={`mic-button ${
            listening
              ? "mic-active"
              : ""
          }`}
          onClick={startListening}
          disabled={thinking}
        >
          🎙️
        </button>


        {/* Stop Speaking */}

        {speaking && (
          <button
            className="stop-speaking-button"
            onClick={stopSpeaking}
          >
            🔇 Stop
          </button>
        )}

      </div>


      {/* Conversation */}

      <div className="conversation">

        {messages.length === 0 ? (

          <div className="empty-chat">

            <div>💬</div>

            <h3>
              Ammaa AI se baat karein
            </h3>

            <p>
              Jaise:
              <br />
              "Namaste Ammaa AI"
              <br />
              "Aaj meri medicine kab hai?"
              <br />
              "Aaj kya karna hai?"
              <br />
              "What is my medicine time?"
            </p>

          </div>

        ) : (

          messages.map(
            (message, index) => (

              <div
                key={index}
                className={`chat-message ${
                  message.role === "user"
                    ? "user-message"
                    : "ai-message"
                }`}
              >

                <div className="message-avatar">
                  {message.role === "user"
                    ? "👩"
                    : "🤖"}
                </div>

                <div className="message-content">
                  {message.content}
                </div>

              </div>

            )
          )

        )}

      </div>


      {/* Text Input */}

      <div className="chat-input-area">

        <input
          type="text"
          placeholder="Yahan message likhiye..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />


        <button
          onClick={() => sendMessage()}
          disabled={
            thinking ||
            !text.trim()
          }
        >
          ➤
        </button>

      </div>

    </div>
  );
}

export default Chat;