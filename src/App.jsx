import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Shell from './components/layout/Shell';

export default function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
