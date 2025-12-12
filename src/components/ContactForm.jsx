import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";

// Environment variables for API
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;
const MAX_MESSAGES_PER_DAY = parseInt(
  import.meta.env.VITE_MAX_MESSAGES_PER_DAY,
  10
);

// Constants
const MIN_MESSAGE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 115;
const RATE_LIMIT_TIMEOUT = 1000;

// Helper function to show Swal alert with space key prevention
const showAlert = (config) => {
  const preventSpaceConfirm = (e) => {
    if (e.code === "Space") e.preventDefault();
  };

  return Swal.fire({
    ...config,
    didOpen: () => {
      const confirmBtn = Swal.getConfirmButton();
      if (confirmBtn) {
        confirmBtn.addEventListener("keydown", preventSpaceConfirm);
      }
      config.didOpen?.();
    },
    willClose: () => {
      const confirmBtn = Swal.getConfirmButton();
      if (confirmBtn) {
        confirmBtn.removeEventListener("keydown", preventSpaceConfirm);
      }
      config.willClose?.();
    },
  });
};

// Helper function to show rate limit alert
const showRateLimitAlert = () => {
  const today = new Date().toDateString();
  const alertShownToday = localStorage.getItem("alertShownToday") === today;
  if (!alertShownToday) {
    showAlert({
      icon: "warning",
      width: 320,
      text: "you've reached your daily message limit!",
      confirmButtonColor: "#181818",
      iconColor: "#bd0000",
    });
    localStorage.setItem("alertShownToday", today);
  }
};

// ContactForm component for anonymous messages
function ContactForm({ onMessageSent }) {
  // State variables
  const [message, setMessage] = useState(""); // Message text
  const [isFocused, setIsFocused] = useState(false); // Textarea focus state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [placeholder, setPlaceholder] = useState(
    "send anonymous message here!"
  ); // Placeholder text
  const [rateLimitReached, setRateLimitReached] = useState(false); // Rate limit flag

  useEffect(() => {
    // Toggle body scroll class based on textarea focus
    document.body.classList.toggle("scroll", isFocused);
  }, [isFocused]);

  useEffect(() => {
    // Check rate limit on component mount
    checkRateLimit();
  }, []);

  // Check and handle rate limiting
  const checkRateLimit = () => {
    const today = new Date().toDateString();
    const lastSendDate = localStorage.getItem("lastSendDate");
    const messageCount = parseInt(
      localStorage.getItem("messageCount") || "0",
      10
    );

    if (lastSendDate !== today) {
      // Reset count for new day
      localStorage.setItem("messageCount", "0");
      localStorage.setItem("lastSendDate", today);
      localStorage.removeItem("alertShownToday");
      setRateLimitReached(false);
    } else if (messageCount >= MAX_MESSAGES_PER_DAY) {
      setRateLimitReached(true);
      showRateLimitAlert();
    }
  };

  // Sanitize input to remove HTML and scripts using DOMPurify
  const sanitizeInput = (input) => {
    // DOMPurify.sanitize removes all HTML tags and dangerous content
    // ALLOWED_TAGS: [] means no HTML tags are allowed, only plain text
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true, // Keep the text content, remove only tags
    }).trim();
  };

  // Send message data to API
  const sendData = async () => {
    // Check rate limit first
    if (rateLimitReached) {
      showRateLimitAlert();
      return;
    }

    // Sanitize message
    const sanitizedMessage = sanitizeInput(message);

    // Validate empty message
    if (sanitizedMessage.trim() === "") {
      showAlert({
        icon: "warning",
        width: 320,
        text: "Please enter a message before sending.",
        confirmButtonColor: "#181818",
        iconColor: "#bd0000",
      });
      setIsFocused(false);
      setPlaceholder("do you want to try one more time?");
      return;
    }

    // Validate minimum message length
    if (sanitizedMessage.length < MIN_MESSAGE_LENGTH) {
      showAlert({
        icon: "warning",
        width: 320,
        text: "Send a message of at least 1 sentence",
        confirmButtonColor: "#181818",
        iconColor: "#bd0000",
      });
      return;
    }

    setIsLoading(true);
    const now = new Date();

    // Format date string in Indonesian locale
    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);

    // Format time string
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            tanggal: formattedDate,
            waktu: formattedTime,
            message: sanitizedMessage,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      await response.json();
      // Success - message sent
      showAlert({
        icon: "success",
        width: 320,
        confirmButtonColor: "#181818",
        iconColor: "#00c9a7",
        text: "Anonymous message successfully sent!",
      });
      onMessageSent();

      // Update rate limit
      const currentCount =
        parseInt(localStorage.getItem("messageCount") || "0", 10) + 1;
      localStorage.setItem("messageCount", currentCount.toString());
      localStorage.setItem("lastSendDate", new Date().toDateString());
      if (currentCount >= MAX_MESSAGES_PER_DAY) {
        setRateLimitReached(true);
      }
    } catch (error) {
      // Log error only in development mode
      if (import.meta.env.DEV) {
        console.error("Error sending message:", error);
      }
      showAlert({
        icon: "error",
        title: "Oops...",
        width: 320,
        text: "Something went wrong! Please try again.",
        confirmButtonColor: "#181818",
        iconColor: "#bd0000",
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
              placeholder={isFocused ? "" : placeholder}
              required
              maxLength={MAX_MESSAGE_LENGTH}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setPlaceholder("send anonymous message here!");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendData();
                }
              }}
              className={isFocused ? "show" : ""}
              disabled={rateLimitReached}
            />
          </form>
          <button
            className={`submit-btn ${isFocused ? "show" : ""} ${
              isLoading ? "button--loading" : ""
            }`}
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
