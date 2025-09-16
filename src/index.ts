import cors from 'cors';
import express from 'express';
import serverless from 'serverless-http';
import produtosRouter from './routers/produtosRouter';

// Porta do servidor
const PORT = process.env.PORT || 4000

// Host do servidor
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'

// App Express
const app = express()

// JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Endpoint raiz
app.get('/', (req, res) => {
	res.send('Bem-vindo!')
})

// Cors
app.use(cors({
	origin: '*'
}))

// Rotas
const routerPrefix = '/api';
app.use(routerPrefix, produtosRouter);  // path must route to lambda

// Resposta padrão para quaisquer outras requisições:
app.use((_req, res) => {
	res.status(404)
})

// Inicia o sevidor
app.listen(PORT, () => {
	console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`)
})

module.exports.handler = serverless(app);