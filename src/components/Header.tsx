import { useState, useRef, useEffect } from "react";

type HeaderProps = {
  onClearHistory: () => void;
};

function Header({ onClearHistory }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearHistory = () => {
    const confirmed = window.confirm("Are you sure you want to clear the chat history?");
    if (confirmed) {
      onClearHistory();
      setMenuOpen(false);
    }
  };

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
                <li>
                    ✏️ Change system prompt
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

      <h1 className="app-title">Fading.AI</h1>
      <p className="app-subtitle">
        Your AI assistant for digital communications
      </p>
    </header>
  );
}

export default Header;
