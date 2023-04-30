import http from "http"
import app from "./app"
import { config as loadEnvVars } from "dotenv"

loadEnvVars()

const PORT = process.env.PORT ?? 2907

const server = http.createServer(app)
server.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`))