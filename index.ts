import express from 'express'
import { GameLoop } from './GameLoop'
import * as SocketIO from 'socket.io'




interface Player {
    x: number,
    y: number,
    id: string
}

declare global {
    interface Array<T> {
        search(objective: number | string, param?: string): T;
    }
}

Array.prototype.search = function (o, p) {
    return this.find(el => el[p ?? 'id'] === o)
}


const app = express()
app.use(express.static('client/build'))


const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: { methods: ["GET", "POST"] },
    origins: [
        "http://*"
    ]
}) as SocketIO.Namespace

const port = process.env.PORT || 3000



server.listen(port, () => {
    console.log(`Test app listening on port ${port}!`)
    loop = new GameLoop((delta) => {

        players.forEach(({ player, input }) => {
            player.x = Math.min(512, Math.max(0, player.x + input.x * SPEED * delta))
            player.y = Math.min(512, Math.max(0, player.y + input.y * SPEED * delta))
        })
        io.emit("state", players.map(p => p.player))
    })
});

const WIDTH = 512
const HEIGHT = 512
const SPEED = .2

var players: { socket: SocketIO.Socket, player: Player, input: { x: number, y: number } }[] = []
var loop: GameLoop


io.on('connection', (socket) => {
    const id = socket.id
    players.push({ socket, player: { x: Math.random() * WIDTH, y: Math.random() * HEIGHT, id }, input: { x: 0, y: 0 } })

    console.log(`Client ${id} connected`)



    socket.on("disconnect", () => {
        players = players.filter(p => p.player.id !== id)
        console.log(`Client ${id} disconnected`)

    });


    socket.on("input", (input: { x: number, y: number }) => {


        const player = players.find(p => p.player.id === id)
        if (player) player.input = input
    })
});





