import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Entertainment() {

  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  // --------------------------------
  // Categories
  // --------------------------------

  const categories = [
    {
      id: "all",
      name: "All",
      emoji: "✨"
    },
    {
      id: "bhajan",
      name: "Bhajan & Aarti",
      emoji: "🙏"
    },
    {
      id: "music",
      name: "Music",
      emoji: "🎵"
    },
    {
      id: "stories",
      name: "Stories",
      emoji: "📖"
    },
    {
      id: "fun",
      name: "Fun",
      emoji: "😂"
    },
    {
      id: "youtube",
      name: "YouTube",
      emoji: "📺"
    }
  ];

  // --------------------------------
  // Fetch Entertainment
  // --------------------------------

  useEffect(() => {

    fetchEntertainment();

  }, []);

  const fetchEntertainment = async () => {

    try {

      const response =
        await API.get(
          "/api/entertainment/"
        );

      setItems(response.data);

    } catch (error) {

      console.error(
        "Entertainment error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  // --------------------------------
  // Filter
  // --------------------------------

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter(
          (item) =>
            item.category ===
            selectedCategory
        );

  // --------------------------------
  // Open Item
  // --------------------------------

  const openItem = (item) => {

    if (!item.url) {
      return;
    }

    window.open(
      item.url,
      "_blank"
    );
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
          <h1>
            🎵 Entertainment
          </h1>

          <p>
            Ammaa ke liye manoranjan
          </p>
        </div>

      </div>

      {/* Categories */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "15px",
          overflowX: "auto"
        }}
      >

        {categories.map(
          (category) => (

            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  category.id
                )
              }
              style={{
                padding:
                  "12px 16px",
                borderRadius:
                  "15px",
                border: "none",
                cursor:
                  "pointer",
                whiteSpace:
                  "nowrap",
                fontSize:
                  "14px"
              }}
            >

              {category.emoji}{" "}
              {category.name}

            </button>

          )
        )}

      </div>

      {/* Content */}

      <div
        style={{
          padding: "20px"
        }}
      >

        {loading ? (

          <div>
            Loading entertainment...
          </div>

        ) : filteredItems.length === 0 ? (

          <div
            style={{
              textAlign: "center",
              padding: "40px"
            }}
          >

            <div
              style={{
                fontSize: "50px"
              }}
            >
              🎵
            </div>

            <h3>
              Abhi content available nahi hai
            </h3>

            <p>
              Entertainment content
              baad mein add kiya ja sakta hai.
            </p>

          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px"
            }}
          >

            {filteredItems.map(
              (item) => (

                <div
                  key={item._id}
                  onClick={() =>
                    openItem(item)
                  }
                  style={{
                    padding: "20px",
                    borderRadius: "20px",
                    cursor: item.url
                      ? "pointer"
                      : "default",
                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.1)"
                  }}
                >

                  <div
                    style={{
                      fontSize: "45px"
                    }}
                  >
                    {item.category ===
                    "bhajan"
                      ? "🙏"
                      : item.category ===
                        "music"
                      ? "🎵"
                      : item.category ===
                        "stories"
                      ? "📖"
                      : item.category ===
                        "fun"
                      ? "😂"
                      : "📺"}
                  </div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                  <small>
                    {item.language}
                  </small>

                  {item.url && (
                    <div
                      style={{
                        marginTop:
                          "15px"
                      }}
                    >
                      ▶️ Play
                    </div>
                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Entertainment;