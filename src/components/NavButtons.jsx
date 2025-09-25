import React from 'react';
import navLinks from '../data/navLinks';

// NavButtons component renders social media navigation
function NavButtons() {
  return (
    <nav>
      <ul>
        {/* Map over navLinks to create buttons */}
        {navLinks.map(({ id, label, iconClass, redirectFunction }) => (
          <li key={id}>
            {/* Button for each social link */}
            <button onClick={redirectFunction}>
              <i className={iconClass}></i>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavButtons;
