import { useState, useRef, useEffect } from "react";

type HeaderProps = {
  onClearHistory: () => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
};

function Header({ onClearHistory, systemPrompt, setSystemPrompt }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditPrompt, setShowEditPrompt] = useState(false);
  const [newPrompt, setNewPrompt] = useState(systemPrompt);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When the system prompt changes, update the prompt in the popup
  useEffect(() => {
    setNewPrompt(systemPrompt);
  }, [systemPrompt]);

  return (
    <header className="app-header header-with-menu">
      <div className="menu-container" ref={menuRef}>
        <button className="menu-button" onClick={() => setMenuOpen(prev => !prev)}>
          ☰
        </button>
        {menuOpen && (
          <nav className="menu-dropdown" role="menu" aria-label="Main menu">
            <div className="menu-items-container">
              <ul>
                <li
                    tabIndex={0}
                    role="menuitem"
                    onClick={() => {
                      setShowConfirm(true);
                      setMenuOpen(false);
                  }}

                >
                    🧹 Clean chat history
                </li>
                <li
                    tabIndex={0}
                    role="menuitem"
                    onClick={() => {
                    setShowEditPrompt(true);
                    setMenuOpen(false);
                  }}
                >
                    ✏️ Edit system prompt
                </li>
             </ul>
            </div>
          </nav> 
        )}
      </div>

      {showConfirm && (
        <div className="popup-backdrop">
          <div className="popup">
            <p>
                Are you sure you want to clear the chat history? This action cannot be undone
            </p>
            <div className="popup-buttons">
              <button className="confirm-button" onClick={() => {
                onClearHistory();
                setShowConfirm(false);
              }}>
                Yes
              </button>
              <button className="cancel-button" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditPrompt && (
        <div className="popup-backdrop">
          <div className="popup">
            <p>Edit the system prompt:</p>
            <textarea
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              rows={5}
              style={{ width: "100%" }}
            />
            <div className="popup-buttons">
              <button
                className="confirm-button"
                onClick={() => {
                  // Use default prompt if user provides an empty text
                  setSystemPrompt(newPrompt.trim() || "You are an expert assistant. Respond with a concise answer.");
                  setShowEditPrompt(false);
                }}
              >
                Save
              </button>
              <button className="cancel-button" onClick={() => setShowEditPrompt(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="app-title">Fading.AI</h1>
      <p className="app-subtitle">
        Your AI assistant for digital communications
      </p>
    </header>
  );
}

export default Header;
