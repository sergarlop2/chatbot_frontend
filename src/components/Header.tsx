import { useState, useRef, useEffect } from "react";

type HeaderProps = {
  onClearHistory: () => void;
};

function Header({ onClearHistory }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <header className="app-header header-with-menu">
      <div className="menu-container" ref={menuRef}>
        <button className="menu-button" onClick={() => setMenuOpen(prev => !prev)}>
          ☰
        </button>
        {menuOpen && (
          <nav className="menu-dropdown" role="menu" aria-label="Main menu">
            <ul>
              <li
                tabIndex={0}
                role="menuitem"
                onClick={() => {
                  onClearHistory();
                  setMenuOpen(false);
                }}
              >
                🗑 Clean chat history
              </li>
              {/* Puedes añadir más <li> con opciones aquí */}
            </ul>
          </nav> 
        )}
      </div>

      <h1 className="app-title">Fading.AI</h1>
      <p className="app-subtitle">
        Your AI assistant for digital communications
      </p>
    </header>
  );
}

export default Header;
