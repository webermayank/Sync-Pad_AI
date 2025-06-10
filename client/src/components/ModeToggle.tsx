import React from 'react';
import '../styles/toggle.css'; // Assuming you have a CSS file for styles
type ModeToggleProps = {
  mode: 'roast' | 'normal';
  setMode: React.Dispatch<React.SetStateAction<'roast' | 'normal'>>;
};

export type Mode = 'roast' | 'normal';
export function ModeToggle({ mode, setMode }: ModeToggleProps) {
   return (
    <div className="checkbox-wrapper-5">
        <div className="check">
            <input type="checkbox" id="check-5" 
            checked= {mode=== 'roast'}
            onChange={() =>setMode((prev) =>(prev=== 'roast' ? 'normal' : 'roast'))}
            />
        <label htmlFor="check-5" title={mode === 'roast' ? "Roast Mode" : "Normal Mode"}></label>
        </div>
        <span style={{ marginLeft: 16, fontWeight: 600 }}>
        {mode === 'roast' ? 'Roast Mode' : 'Normal Mode'}
      </span>
    </div>
   );
 }