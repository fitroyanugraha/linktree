import React, { useState } from 'react';
import Header from './components/Header';
import NavButtons from './components/NavButtons';
import ContactForm from './components/ContactForm';
import './style.css';

// Main App component
function App() {
  // State for showing form or success message
  const [showForm, setShowForm] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  // Handle message sent callback
  const handleMessageSent = () => {
    setShowForm(false);
    setShowMessage(true);
    document.body.classList.remove('scroll');
  };

  return (
    <main>
      <Header />
      <NavButtons />
      {/* Conditionally render form or message */}
      {showForm && <ContactForm onMessageSent={handleMessageSent} />}
      <span id="message-sent" className="message-sent" style={{display: showMessage ? 'block' : 'none'}}>Your anonymous message has been sent.</span>
    </main>
  );
}

export default App;
