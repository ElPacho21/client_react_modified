import React from "react";
import './image_button.css';

interface ImageButtonProps {
    className?: React.CSSProperties,
    imageUrl: string,
    hidden?: boolean,
    onClick: () => any,
    title?: string,
}

export default function ImageButton(props: ImageButtonProps) {
    if (props.hidden === true) {
        return null;
    }
    return (
        <button className="imageButton" onClick={props.onClick} title={props.title} aria-label={props.title}>
            <img alt={props.title || ""} src={props.imageUrl} style={props.className}/>
        </button>
    )
}
