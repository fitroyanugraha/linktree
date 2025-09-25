import React, { useState } from 'react';
import Header from './components/Header';
import NavButtons from './components/NavButtons';
import ContactForm from './components/ContactForm';
import './style.css';

function App() {
  const [showForm, setShowForm] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleMessageSent = () => {
    setShowForm(false);
    setShowMessage(true);
    document.body.classList.remove('scroll');
  };

  return (
    <main>
      <Header />
      <NavButtons />
      {showForm && <ContactForm onMessageSent={handleMessageSent} />}
      <span id="message-sent" className="message-sent" style={{display: showMessage ? 'block' : 'none'}}>Your anonymous message has been sent.</span>
    </main>
  );
}

export default App;
