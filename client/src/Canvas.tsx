/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

const WIDTH = 512
const HEIGHT = 512
const PLAYER_SIZE = 10

const Canvas: React.FC = () => {
    const canvas = useRef<HTMLCanvasElement>(null)

    const [players, setPlayers] = useState<
        { x: number; y: number; id: string }[]
    >([])
    const [socket, setSocket] = useState<Socket | null>(null)
    const [input, setInput] = useState({ up: 0, down: 0, right: 0, left: 0 })
    const inputRef = useRef(input)
    const [id, setId] = useState("")

    useEffect(() => {
        draw()
        window.addEventListener("keydown", keyDown)
        window.addEventListener("keyup", keyUp)
        setSocket(io("http://localhost:3000"))
        setSocket((s) => {
            s!.on("connect", () => setId(s!.id))
            s!.on("state", (state) => setPlayers(state))
            return s
        })
    }, [])

    const draw = () => {
        if (canvas.current) {
            const context = canvas.current.getContext("2d")
            context!.fillStyle = "#2b2e4a"
            context!.fillRect(0, 0, WIDTH, HEIGHT)
            players.forEach((p) => {
                context!.fillStyle = p.id === id ? "#fffc41" : "#e84545"
                context?.beginPath()
                context?.arc(p.x, p.y, PLAYER_SIZE, 0, Math.PI * 2)
                context?.fill()
            })
        }
    }
    useEffect(draw, [players])
    //@ts-ignore
    useEffect(() => (inputRef.current = input), [input])

    const keyDown = (e: KeyboardEvent) => {
        var change = false
        switch (e.key) {
            case "ArrowRight":
                if (!inputRef.current.right) change = true
                setInput({ ...inputRef.current, right: 1 })
                break
            case "ArrowLeft":
                if (!inputRef.current.left) change = true
                setInput({ ...inputRef.current, left: 1 })
                break
            case "ArrowUp":
                if (!inputRef.current.up) change = true
                setInput({ ...inputRef.current, up: 1 })
                break
            case "ArrowDown":
                if (!inputRef.current.down) change = true
                setInput({ ...inputRef.current, down: 1 })
                break
            default:
                break
        }
    }
    const keyUp = (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowRight":
                setInput({ ...inputRef.current, right: 0 })
                break
            case "ArrowLeft":
                setInput({ ...inputRef.current, left: 0 })
                break
            case "ArrowUp":
                setInput({ ...inputRef.current, up: 0 })
                break
            case "ArrowDown":
                setInput({ ...inputRef.current, down: 0 })
                break
            default:
                break
        }
    }
    useEffect(() => {
        socket?.emit("input", {
            x: -input.left + input.right,
            y: -input.up + input.down,
        })
    }, [input])

    return (
        <div>
            <canvas
                width={WIDTH}
                height={HEIGHT}
                style={{ margin: "auto" }}
                ref={canvas}
            ></canvas>
        </div>
    )
}
export default Canvas
