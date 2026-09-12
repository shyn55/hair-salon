import React from 'react';
import { ChevronRight } from 'lucide-react';

const BackButton = ({ onBack, style = {} }) => (
    <button
        onClick={onBack}
        aria-label="بازگشت"
        style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#F7F5F0',
            WebkitTapHighlightColor: 'transparent',
            ...style,
        }}
    >
        <ChevronRight size={22} color="#F7F5F0" strokeWidth={1.5} />
    </button>
);

export default BackButton;
