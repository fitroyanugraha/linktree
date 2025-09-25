import React from 'react';
import navLinks from '../data/navLinks';

function NavButtons() {
  return (
    <nav>
      <ul>
        {navLinks.map(({ id, label, iconClass, redirectFunction }) => (
          <li key={id}>
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
