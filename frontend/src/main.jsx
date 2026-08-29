// Main React 18 Mounting Entry Point
const rootElement = document.getElementById('root');
if (rootElement && window.App) {
  ReactDOM.createRoot(rootElement).render(<window.App />);
}
