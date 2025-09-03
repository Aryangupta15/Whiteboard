import React from 'react';
import './Toolbar.css';
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { CgBorderStyleDashed } from "react-icons/cg";
import { CgBorderStyleDotted } from "react-icons/cg";
import { PiWaveSineDuotone } from "react-icons/pi";
import { GoCopy } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosLink } from "react-icons/io";

const strokeColors = ['#EF4444', '#22C55E', '#3B82F6', '#ffffffff', '#000000ff', '#F59E42', '#00fffbff', '#F8A5B3'];
const backgroundColors = ['#F8A5B3', '#000000ff', '#BBF7D0', '#ffffffff', '#93E7FF', '#FDE68A', '#22C55E'];

const Toolbar = ({
    selectedColor,
    onColorSelect,
    backgroundColor,
    onBackgroundColorSelect,
    strokeWidth,
    onStrokeWidthSelect,
    strokeStyle,
    onStrokeStyleSelect,
    opacity,
    onOpacityChange,
    onCopyCanvas,
    onClearCanvas
}) => {

    const handleCopy = async () => {
        if (onCopyCanvas) {
            try {
                await onCopyCanvas();
            } catch (error) {
                console.error('Failed to copy canvas:', error);
            }
        }
    };

    const handleClear = () => {
        if (onClearCanvas) {
            // Enhanced confirmation dialog
            const confirmed = window.confirm(
                '⚠️ Clear entire canvas?\n\nThis will delete everything from the canvas.\n\nAre you sure you want to continue?'
            );
            if (confirmed) {
                try {
                    onClearCanvas();
                } catch (error) {
                    console.error('Failed to clear canvas:', error);
                }
            }
        }
    };


    const getStrokeWidthClass = (width) => {
        if (width === 1) return 'thin';
        if (width === 4) return 'thick';
        return 'medium';
    };

    return (
        <div className="toolbar-container">
            <div className="toolbar-section">
                <div className="toolbar-label">Stroke</div>
                <div className="color-group">
                    {strokeColors.map((color, idx) => (
                        <button
                            key={idx}
                            className={`color-btn  ${selectedColor === color ? 'selected' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => onColorSelect(color)}
                        />
                    ))}
                </div>
            </div>

            <div className="toolbar-section">
                <div className="toolbar-label">Background</div>
                <div className="color-group">
                    {backgroundColors.map((color, idx) => (
                        <button
                            key={idx}
                            className={`color-btn bg-btn ${backgroundColor === color ? 'selected' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => onBackgroundColorSelect(color)}
                        />
                    ))}
                </div>
            </div>

            <div className="toolbar-section">
                <div className="toolbar-label">Stroke width</div>
                <div className="option-group">
                    <button
                        className={`option-btn stroke-width thin ${strokeWidth === 1 ? 'selected' : ''}`}
                        onClick={() => onStrokeWidthSelect(1)}
                    ></button>
                    <button
                        className={`option-btn stroke-width medium ${strokeWidth === 2 ? 'selected' : ''}`}
                        onClick={() => onStrokeWidthSelect(2)}
                    ></button>
                    <button
                        className={`option-btn stroke-width thick ${strokeWidth === 4 ? 'selected' : ''}`}
                        onClick={() => onStrokeWidthSelect(4)}
                    ></button>
                </div>
            </div>

            <div className="toolbar-section">
                <div className="toolbar-label">Stroke style</div>
                <div className="option-group">
                    <button
                        className={`option-btn stroke-style ${strokeStyle === 'solid' ? 'selected' : ''}`}
                        onClick={() => onStrokeStyleSelect('solid')}
                    >
                        <TfiLayoutLineSolid />
                    </button>
                    <button
                        className={`option-btn stroke-style ${strokeStyle === 'dashed' ? 'selected' : ''}`}
                        onClick={() => onStrokeStyleSelect('dashed')}
                    >
                        <CgBorderStyleDashed />
                    </button>
                    <button
                        className={`option-btn stroke-style ${strokeStyle === 'dotted' ? 'selected' : ''}`}
                        onClick={() => onStrokeStyleSelect('dotted')}
                    >
                        <CgBorderStyleDotted />
                    </button>
                </div>
            </div>

            <div className="toolbar-section">
                <div className="toolbar-label">Opacity</div>
                <div className="slider-row">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={opacity}
                        className="toolbar-slider"
                        onChange={(e) => onOpacityChange(parseInt(e.target.value))}
                    />
                </div>
                <div className="opacity-values">
                    <span>0</span>
                    <span>{opacity}</span>
                </div>
            </div>

            <div className="toolbar-section">
                <div className="toolbar-label">Actions</div>
                <div className="action-group">
                    <button
                        className="action-btn"
                        title="Copy Canvas to Clipboard"
                        onClick={handleCopy}
                    >
                        <GoCopy />
                    </button>
                    <button
                        className="action-btn"
                        title="Clear All Canvas Content"
                        onClick={handleClear}
                    >
                        <AiOutlineDelete />
                    </button>
                    <button className="action-btn" title="Link"><IoIosLink /></button>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
