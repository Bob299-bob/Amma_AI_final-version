import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Chat() {
  const navigate = useNavigate();

  // --------------------------------
  // States
  // --------------------------------

  const [languageMode, setLanguageMode] = useState("english");

  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [text, setText] = useState("");

  const recognitionRef = useRef(null);

  // Prevent duplicate API calls
  const sendingRef = useRef(false);

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

    // IMPORTANT
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // --------------------------------
    // Recognition Start
    // --------------------------------

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setListening(true);
    };

    // --------------------------------
    // Recognition End
    // --------------------------------

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setListening(false);
    };

    // --------------------------------
    // Recognition Error
    // --------------------------------

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);

      setListening(false);

      if (event.error === "not-allowed") {
        alert("Please allow microphone permission.");
      }
    };

    // --------------------------------
    // Recognition Result
    // --------------------------------

    recognition.onresult = (event) => {
      let transcript = "";

      // Collect ALL final speech results
      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          transcript +=
            event.results[i][0].transcript + " ";
        }
      }

      transcript = transcript.trim();

      console.log(
        "FINAL SPEECH:",
        transcript
      );

      if (!transcript) {
        return;
      }

      // Stop recognition after complete sentence
      try {
        recognition.stop();
      } catch (error) {
        console.log(
          "Recognition stop:",
          error
        );
      }

      // Prevent duplicate request
      if (sendingRef.current) {
        console.log(
          "Duplicate speech blocked"
        );
        return;
      }

      setText(transcript);

      sendMessage(transcript);
    };

    recognitionRef.current = recognition;

    // --------------------------------
    // Cleanup
    // --------------------------------

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
        "Your browser does not support Speech Recognition."
      );
      return;
    }

    if (
      thinking ||
      listening ||
      speaking
    ) {
      return;
    }

    // Stop previous speech
    stopSpeaking();

    try {
      // --------------------------------
      // Speech Language
      // --------------------------------

      if (languageMode === "english") {
        recognitionRef.current.lang =
          "en-IN";
      } else if (
        languageMode === "hindi"
      ) {
        recognitionRef.current.lang =
          "hi-IN";
      } else {
        // Auto mode
        recognitionRef.current.lang =
          "en-IN";
      }

      console.log(
        "Recognition language:",
        recognitionRef.current.lang
      );

      recognitionRef.current.start();

    } catch (error) {
      console.log(
        "Recognition start error:",
        error
      );
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
    if (!text) {
      return "";
    }

    return text
      // Remove **bold**
      .replace(/\*\*(.*?)\*\*/g, "$1")

      // Remove *italic*
      .replace(/\*(.*?)\*/g, "$1")

      // Remove headings
      .replace(/#{1,6}\s?/g, "")

      // Remove code marks
      .replace(/`{1,3}/g, "")

      // Remove underscore / tilde
      .replace(/[_~]/g, "")

      // Remove bullets
      .replace(/[-•]\s/g, "")

      // New lines → pause
      .replace(/\n+/g, ". ")

      // Multiple spaces
      .replace(/\s+/g, " ")

      .trim();
  };

  // --------------------------------
  // Detect Reply Language
  // --------------------------------

  const detectReplyLanguage = (
    message
  ) => {
    if (!message) {
      return "en-IN";
    }

    const hindiPattern =
      /[\u0900-\u097F]/;

    if (
      hindiPattern.test(message)
    ) {
      return "hi-IN";
    }

    return "en-IN";
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

    if (!cleanMessage) {
      return;
    }

    const speech =
      new SpeechSynthesisUtterance(
        cleanMessage
      );

    // --------------------------------
    // Voice Language
    // --------------------------------

    if (
      languageMode === "english"
    ) {
      speech.lang = "en-IN";
    } else if (
      languageMode === "hindi"
    ) {
      speech.lang = "hi-IN";
    } else {
      speech.lang =
        detectReplyLanguage(
          cleanMessage
        );
    }

    console.log(
      "Speaking language:",
      speech.lang
    );

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

    window.speechSynthesis.speak(
      speech
    );
  };

  // --------------------------------
  // Send Message
  // --------------------------------

  const sendMessage = async (
    messageText = text
  ) => {
    const cleanMessage =
      messageText?.trim();

    if (!cleanMessage) {
      return;
    }

    // --------------------------------
    // Duplicate Protection
    // --------------------------------

    if (sendingRef.current) {
      console.log(
        "Duplicate message blocked:",
        cleanMessage
      );

      return;
    }

    sendingRef.current = true;

    // --------------------------------
    // User Message
    // --------------------------------

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
        "Language:",
        languageMode
      );

      // --------------------------------
      // Backend Request
      // --------------------------------

      const response =
        await API.post(
          "/api/chat/",
          {
            message: cleanMessage,
            language: languageMode,
          }
        );

      console.log(
        "Backend response:",
        response.data
      );

      const reply =
        response?.data?.reply ||
        "Sorry, I didn't get a response.";

      // --------------------------------
      // AI Message
      // --------------------------------

      const aiMessage = {
        role: "assistant",
        content: reply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      // --------------------------------
      // Voice Response
      // --------------------------------

      speak(reply);

    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I can't connect at this time.",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

    } finally {
      setThinking(false);

      // Allow next message
      sendingRef.current = false;
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
          onClick={() =>
            navigate("/home")
          }
        >
          ←
        </button>

        <div>
          <h1>🤖 Ammaa AI</h1>

          <p>
            Personal Voice Assistant
          </p>
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
            ? "Listening..."
            : thinking
            ? "Thinking..."
            : speaking
            ? "Speaking..."
            : "Ammaa AI ❤️"}
        </h2>

        <p className="jarvis-status">
          {listening
            ? "Speak..."
            : thinking
            ? "One second..."
            : speaking
            ? "Listening..."
            : "Press microphone"}
        </p>

        {/* Microphone */}

        <button
          className={`mic-button ${
            listening
              ? "mic-active"
              : ""
          }`}
          onClick={
            startListening
          }
          disabled={
            thinking ||
            listening ||
            speaking
          }
        >
          🎙️
        </button>

        {/* Stop Speaking */}

        {speaking && (
          <button
            className="stop-speaking-button"
            onClick={
              stopSpeaking
            }
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
              Talk to Ammaa AI
            </h3>

            <p>

              For example:

              <br />

              "Hello Ammaa AI"

              <br />

              "How are you?"

              <br />

              "When is my medicine today?"

              <br />

              "What do I need to do today?"

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

                  {message.role ===
                  "user"
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
          placeholder="Type your message..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={
            handleKeyDown
          }
        />

        <button
          onClick={() =>
            sendMessage()
          }
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
