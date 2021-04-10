import React, { useState } from "react"
import "./App.css"
import Canvas from "./Canvas"

function App() {
    const [list, setList] = useState<string[]>([])
    const [inputText, setInputText] = useState("")
    const [error, setError] = useState("")

    return (
        <div className="App">
            <input
                type="text"
                data-testid="item-input"
                value={inputText}
                onChange={(e) => {
                    if (e.target.value.trim()) {
                        setInputText(e.target.value)
                        setError("")
                    } else {
                    }
                }}
            />
            <button
                data-testid="submit-button"
                onClick={() => {
                    if (inputText) {
                        setList([...list, inputText])
                        setInputText("")
                    } else {
                        setError("No puede ser vacío")
                    }
                }}
            >
                +
            </button>
            {!!error && (
                <div data-testid="error-text" style={{ color: "#fffc41" }}>
                    {error}
                </div>
            )}

            {list.map((item) => (
                <div data-testid={item} key={item}>
                    {item}{" "}
                    <button
                        data-testid={`delete-${item}-button`}
                        onClick={() => setList(list.filter((i) => i !== item))}
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    )
}

export default App
