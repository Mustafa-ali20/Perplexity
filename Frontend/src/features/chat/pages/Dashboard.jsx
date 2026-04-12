import { useEffect, useRef, useState, useMemo } from "react";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChatId } from "../chat.slice";
import "./Dashboard.scss";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    handleInitializeSocket,
    handleOpenChat,
    handleGetChats,
    handleSendMessage,
  } = useChat();

  const { user } = useSelector((state) => state.auth);
  const chats = useSelector((state) => state.chat.chat);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      handleInitializeSocket();
      handleGetChats();
    }
  }, []);

  // after chats are loaded, restore last open chat from localStorage
  useEffect(() => {
    const savedChatId = localStorage.getItem("currentChatId");
    if (savedChatId && chats[savedChatId]) {
      handleOpenChat(savedChatId, chats);
    }
  }, [chats]);

  // save currentChatId to localStorage whenever it changes
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem("currentChatId", currentChatId);
    }
  }, [currentChatId]);

  const currentMessages = useMemo(
    () => (currentChatId ? chats[currentChatId]?.messages || [] : []),
    [currentChatId, chats],
  );
  const chatStarted = !!currentChatId;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    setSidebarOpen(false);
    await handleSendMessage({ message: msg, chatId: currentChatId || null });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
    localStorage.removeItem("currentChatId");
    setSidebarOpen(false);
  };

  const filteredChats = Object.values(chats).filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="dashboard-root">
      <button
        className={`hamburger-btn ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand">
            <span className="brand-dot" />
            <span className="brand-name">Perplexity</span>
          </div>

          <button className="new-chat-btn" onClick={handleNewChat}>
            <span className="plus-icon">+</span>
            New Chat
          </button>

          <div className="search-wrap">
            <span className="search-icon">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search chats..."
              className="sidebar-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="recents-section">
          <span className="recents-label">Recents</span>
          <div className="chat-list">
            {filteredChats.length === 0 && (
              <p className="no-chats">No chats yet</p>
            )}
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                className={`chat-item ${currentChatId === chat.id ? "active" : ""}`}
                onClick={() => {
                  handleOpenChat(chat.id, chats);
                  setSidebarOpen(false);
                }}
              >
                <span className="chat-item-dot" />
                <span className="chat-item-title">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="user-name">{user?.username || "User"}</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        {!chatStarted ? (
          <div className="hero">
            <div className="hero-grid" />
            <h1 className="hero-title">Perplexity</h1>
            <p className="hero-sub">Ask anything. Get answers.</p>
            <div className="input-bar hero-input">
              <textarea
                placeholder="Ask anything..."
                className="chat-input"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="spinner" />
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="chat-view">
            <div className="chat-header">
              <span className="brand-dot-sm" />
              <span className="chat-header-title">
                {chats[currentChatId]?.title || "Chat"}
              </span>
            </div>

            <div className="messages-wrap">
              {currentMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`message-row ${msg.role === "user" ? "user-row" : "ai-row"}`}
                >
                  {msg.role !== "user" && (
                    <div className="ai-avatar">
                      <span className="brand-dot-sm" />
                    </div>
                  )}
                  <div
                    className={`bubble ${msg.role === "user" ? "user-bubble" : "ai-bubble"}`}
                  >
                    {msg.role === "ai" ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message-row ai-row">
                  <div className="ai-avatar">
                    <span className="brand-dot-sm" />
                  </div>
                  <div className="bubble ai-bubble typing-bubble">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="input-bar bottom-input">
              <textarea
                placeholder="Ask a follow-up..."
                className="chat-input"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="spinner" />
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
