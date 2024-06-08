import React from 'react';

interface ThemeChangerProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeChanger: React.FC<ThemeChangerProps> = ({ theme, onThemeChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onThemeChange(e.target.value);
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn m-1">
        Theme
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path d="M7 11H17V13H7zM4 7H20V9H4zM10 15H14V17H10z"></path>
          <path d="M5 22Q4.175 22 3.587 21.413Q3 20.825 3 20V6Q3 5.175 3.587 4.588Q4.175 4 5 4H19Q19.825 4 20.413 4.588Q21 5.175 21 6V20Q21 20.825 20.413 21.413Q19.825 22 19 22ZM5 20H19Q19 20 19 20Q19 20 19 20V6Q19 6 19 6Q19 6 19 6H5Q5 6 5 6Q5 6 5 6V20Q5 20 5 20Q5 20 5 20ZM5 6V20V6Z" />
        </svg>
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-3">
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Business"
            value="business"
            onChange={handleChange}
            checked={theme === 'business'}
          />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Dark"
            value="dark"
            onChange={handleChange}
            checked={theme === 'dark'}
          />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Cupcake"
            value="cupcake"
            onChange={handleChange}
            checked={theme === 'cupcake'}
          />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Retro"
            value="retro"
            onChange={handleChange}
            checked={theme === 'retro'}
          />
        </li>
      </ul>
    </div>
  );
};

export default ThemeChanger;