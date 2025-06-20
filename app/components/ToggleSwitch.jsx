import React from "react";
import "../styles/toggleSwitch.css";

export default function ToggleSwitch({ checked, onChange, disabled }) {
    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                disabled={disabled}
            />
            <span className="slider" />
        </label>
    );
} 