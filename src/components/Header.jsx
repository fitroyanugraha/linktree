import React from 'react';
import headerImage from '../assets/Photo-Profile.jpeg';

// Header component displays profile image and name
function Header() {
  // User's name
  const name = "Fitroya Nugraha";
  return (
    <header>
      {/* Profile image */}
      <img src={headerImage} alt="tidak berhasil dimuat" />
      {/* User's name */}
      <h1>{name}</h1>
    </header>
  );
}

export default Header;
