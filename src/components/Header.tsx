import Menu from "./Menu";

type HeaderProps = {
  onClearHistory: () => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
};

function Header({ onClearHistory, systemPrompt, setSystemPrompt }: HeaderProps) {
  return (
    <header className="app-header header-with-menu">
      <Menu
        onClearHistory={onClearHistory}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
      />

      <h1 className="app-title">Fading.AI</h1>
      <p className="app-subtitle">Your AI assistant for digital communications</p>
    </header>
  );
}

export default Header;

