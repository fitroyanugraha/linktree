import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DOMPurify from 'dompurify';

// Environment variables for API
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;
const MAX_MESSAGES_PER_DAY = parseInt(import.meta.env.VITE_MAX_MESSAGES_PER_DAY, 10);

// ContactForm component for anonymous messages
function ContactForm({ onMessageSent }) {
  // State variables
  const [message, setMessage] = useState(''); // Message text
  const [isFocused, setIsFocused] = useState(false); // Textarea focus state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [placeholder, setPlaceholder] = useState('send anonymous massage here!'); // Placeholder text
  const [rateLimitReached, setRateLimitReached] = useState(false); // Rate limit flag

  // Prevent space key on confirm button
  const preventSpaceConfirm = (e) => {
    if (e.code === 'Space') e.preventDefault();
  };

  useEffect(() => {
    // Toggle body scroll class based on textarea focus
    document.body.classList.toggle('scroll', isFocused);
  }, [isFocused]);

  useEffect(() => {
    // Check rate limit on component mount
    checkRateLimit();
  }, []);

  // Check and handle rate limiting
  const checkRateLimit = () => {
    const today = new Date().toDateString();
    const lastSendDate = localStorage.getItem('lastSendDate');
    const messageCount = parseInt(localStorage.getItem('messageCount') || '0', 10);
    const alertShownToday = localStorage.getItem('alertShownToday') === today;

    if (lastSendDate !== today) {
      // Reset count for new day
      localStorage.setItem('messageCount', '0');
      localStorage.setItem('lastSendDate', today);
      localStorage.removeItem('alertShownToday');
      setRateLimitReached(false);
    } else if (messageCount >= MAX_MESSAGES_PER_DAY) {
      setRateLimitReached(true);
      if (!alertShownToday) {
        Swal.fire({
          icon: 'warning',
          width: 320,
          text: 'you\'ve reached your daily message limit!',
          confirmButtonColor: '#181818',
          iconColor: '#bd0000',
          didOpen: () => {
            const confirmBtn = Swal.getConfirmButton();
            if (confirmBtn) {
              confirmBtn.addEventListener('keydown', preventSpaceConfirm);
            }
          },
          willClose: () => {
            const confirmBtn = Swal.getConfirmButton();
            if (confirmBtn) {
              confirmBtn.removeEventListener('keydown', preventSpaceConfirm);
            }
          }
        });
        localStorage.setItem('alertShownToday', today);
      }
    }
  };

  // Sanitize input to remove HTML and scripts using DOMPurify
  const sanitizeInput = (input) => {
    // DOMPurify.sanitize removes all HTML tags and dangerous content
    // ALLOWED_TAGS: [] means no HTML tags are allowed, only plain text
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true // Keep the text content, remove only tags
    }).trim();
  };

  // Send message data to API
  const sendData = async () => {
    // Check rate limit first
    if (rateLimitReached) {
      const today = new Date().toDateString();
      const alertShownToday = localStorage.getItem('alertShownToday') === today;
      if (!alertShownToday) {
        Swal.fire({
          icon: 'warning',
          width: 320,
          text: 'you\'ve reached your daily message limit!',
          confirmButtonColor: '#181818',
          iconColor: '#bd0000',
          didOpen: () => {
            const confirmBtn = Swal.getConfirmButton();
            if (confirmBtn) {
              confirmBtn.addEventListener('keydown', preventSpaceConfirm);
            }
          },
          willClose: () => {
            const confirmBtn = Swal.getConfirmButton();
            if (confirmBtn) {
              confirmBtn.removeEventListener('keydown', preventSpaceConfirm);
            }
          }
        });
        localStorage.setItem('alertShownToday', today);
      }
      return;
    }

    // Sanitize message
    const sanitizedMessage = sanitizeInput(message);

    // Validate empty message
    if (sanitizedMessage.trim() === '') {
      Swal.fire({
        icon: 'warning',
        width: 320,
        text: 'Please enter a message before sending.',
        confirmButtonColor: '#181818',
        iconColor: '#bd0000',
        didOpen: () => {
          const confirmBtn = Swal.getConfirmButton();
          if (confirmBtn) {
            confirmBtn.addEventListener('keydown', preventSpaceConfirm);
          }
        },
        willClose: () => {
          const confirmBtn = Swal.getConfirmButton();
          if (confirmBtn) {
            confirmBtn.removeEventListener('keydown', preventSpaceConfirm);
          }
        }
      });
      setIsFocused(false);
      setPlaceholder('do you want to try one more time?');
      return;
    }

    // Validate minimum message length
    if (sanitizedMessage.length < 20) {
      Swal.fire({
        icon: 'warning',
        width: 320,
        text: 'Send a message of at least 1 sentence',
        confirmButtonColor: '#181818',
        iconColor: '#bd0000',
        didOpen: () => {
          const confirmBtn = Swal.getConfirmButton();
          if (confirmBtn) {
            confirmBtn.addEventListener('keydown', preventSpaceConfirm);
          }
        },
        willClose: () => {
          const confirmBtn = Swal.getConfirmButton();
          if (confirmBtn) {
            confirmBtn.removeEventListener('keydown', preventSpaceConfirm);
          }
        }
      });
      return;
    }

    setIsLoading(true);
    const now = new Date();

    // Format date string in Indonesian locale
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(now);

    // Format time string
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify({ data: { tanggal: formattedDate, waktu: formattedTime, message: sanitizedMessage } })
      });
      const data = await response.json();
      // Success - message sent
      Swal.fire({
        icon: 'success',
        width: 320,
        confirmButtonColor: '#181818',
        iconColor: '#00c9a7',
        text: 'Anonymous message successfully sent!',
        didOpen: () => {
          const confirmBtn = Swal.getConfirmButton();
          if (confirmBtn) {
            confirmBtn.addEventListener('keydown', preventSpaceConfirm);
          }
        },
        willClose: () => {
          const confirmBtn = Swal.getConfirmButton();
          if (confirmBtn) {
            confirmBtn.removeEventListener('keydown', preventSpaceConfirm);
          }
        }
      });
      onMessageSent();

      // Update rate limit
      const currentCount = parseInt(localStorage.getItem('messageCount') || '0', 10) + 1;
      localStorage.setItem('messageCount', currentCount.toString());
      localStorage.setItem('lastSendDate', new Date().toDateString());
      if (currentCount >= MAX_MESSAGES_PER_DAY) {
        setRateLimitReached(true);
      }
    } catch (error) {
      // Log error only in development mode
      if (import.meta.env.DEV) {
        console.error('Error sending message:', error);
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        width: 320,
        text: 'Something went wrong! Please try again.',
        confirmButtonColor: '#181818',
        iconColor: '#bd0000',
        didOpen: () => {
          const confirmBtn = Swal.getConfirmButton();
          if (confirmBtn) {
            confirmBtn.addEventListener('keydown', preventSpaceConfirm);
          }
        },
        willClose: () => {
          const confirmBtn = Swal.getConfirmButton();
          if (confirmBtn) {
            confirmBtn.removeEventListener('keydown', preventSpaceConfirm);
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {rateLimitReached ? (
        <div className="message-sent">
          come back tomorrow to send more messages.
        </div>
      ) : (
        <>
          <form id="contact-form">
            <textarea
              id="message"
              cols="30"
              rows="5"
              placeholder={isFocused ? '' : placeholder}
              required
              maxLength="115"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setPlaceholder('send anonymous massage here!');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendData();
                }
              }}
              className={isFocused ? 'show' : ''}
              disabled={rateLimitReached}
            />
          </form>
          <button
            className={`submit-btn ${isFocused ? 'show' : ''} ${isLoading ? 'button--loading' : ''}`}
            onClick={sendData}
            disabled={!isFocused || isLoading || rateLimitReached}
          >
            <span className="button__text">Send</span>
          </button>
        </>
      )}
    </>
  );
}

export default ContactForm;
