import { config as loadEnvVars } from "dotenv"
loadEnvVars()

import http from "http"
import { ENV_VARIABLES } from "./config/server"
import app from "./app"
import { verifySMTPConnection } from "./utils/nodemailer"

const PORT = ENV_VARIABLES.PORT
const server = http.createServer(app)

verifySMTPConnection()
server.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`))

