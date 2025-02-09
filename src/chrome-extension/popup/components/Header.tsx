import React from "react"; // Ensure React is imported

interface HeaderProps {
    onBackClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBackClick }) => {
    return (
        <div id="header">
            <img 
                onClick={() => onBackClick()} 
                id="header-img" 
                src="https://i.imgur.com/beh78fY.png" 
                alt="genmd logo" 
            />
        </div>
    );
};

export default Header;
