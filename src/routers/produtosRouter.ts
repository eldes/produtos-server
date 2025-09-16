import express from 'express'
import ProdutosRepository from '../repositories/ProdutosRepository'
import Produto from '../models/Produto';

const produtosRouter = express.Router()

produtosRouter.post('/produtos', (req, res) => {
	const produto: Produto = req.body
	ProdutosRepository.criar(produto, (id) => {
        if (id) {
            res.status(201).location(`/produtos/${id}`).send()
        } else {
            res.status(400).send()
        }
    })
})

produtosRouter.get('/produtos', (req, res) => {
	ProdutosRepository.lerTodos((produtos) => res.json(produtos))
})

produtosRouter.get('/produtos/:id', (req, res) => {
	const id: number = +req.params.id
	ProdutosRepository.ler(id, (produto) => {
		if (produto) {
			res.json(produto)
		} else {
			res.status(404).send()
		}
	})
})

produtosRouter.put('/produtos/:id', (req, res) => {
	const id: number = +req.params.id
	ProdutosRepository.atualizar(id, req.body, (notFound) => {
		if (notFound) {
			res.status(404).send()
		} else {
			res.status(204).send()
		}
	})
})

produtosRouter.delete('/produtos/:id', (req, res) => {
	const id: number = +req.params.id
	ProdutosRepository.apagar(id, (notFound) => {
        if (notFound) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    })
})

export default produtosRouter