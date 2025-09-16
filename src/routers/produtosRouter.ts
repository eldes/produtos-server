import express from 'express'
import { prisma } from '../repositories/prisma';

const produtosRouter = express.Router()

// CREATE
produtosRouter.post('/produtos', async (req, res) => {
  try {
    const { nome, fotoUrl, preco } = req.body as { nome?: string; fotoUrl?: string; preco?: string | number }

    if (!nome || !fotoUrl || preco === undefined) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, fotoUrl, preco' })
    }

    // Prisma aceita string para Decimal; garante formato consistente
    const precoValue: string = typeof preco === 'number' ? preco.toFixed(2) : String(preco)

    const criado = await prisma.produto.create({
      data: { nome, fotoUrl, preco: precoValue },
    })

    const criadoOut = { ...criado, preco: (criado as any).preco.toString() }
    return res.status(201).location(`/produtos/${criado.id}`).json(criadoOut)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ erro: 'Falha ao criar produto' })
  }
})

// READ ALL
produtosRouter.get('/produtos', async (_req, res) => {
  try {
    const produtos = await prisma.produto.findMany()
    return res.json(produtos.map((p: any) => ({ ...p, preco: p.preco.toString() })))
  } catch (e) {
    console.error(e)
    return res.status(500).json({ erro: 'Falha ao listar produtos' })
  }
})

// READ ONE
produtosRouter.get('/produtos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ erro: 'ID inválido' })

    const produto = await prisma.produto.findUnique({ where: { id } })
    if (!produto) return res.status(404).send()

    return res.json({ ...produto, preco: (produto as any).preco.toString() })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ erro: 'Falha ao buscar produto' })
  }
})

// UPDATE
produtosRouter.put('/produtos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ erro: 'ID inválido' })

    const { nome, fotoUrl, preco } = req.body as { nome?: string; fotoUrl?: string; preco?: string | number }

    const data: Record<string, unknown> = {}
    if (nome !== undefined) data.nome = nome
    if (fotoUrl !== undefined) data.fotoUrl = fotoUrl
    if (preco !== undefined) {
      const precoValue: string = typeof preco === 'number' ? preco.toFixed(2) : String(preco)
      data.preco = precoValue
    }

    const atualizado = await prisma.produto.update({ where: { id }, data })
    return res.json({ ...atualizado, preco: (atualizado as any).preco.toString() })
  } catch (e: any) {
    if (e?.code === 'P2025') {
      // Prisma: record not found
      return res.status(404).send()
    }
    console.error(e)
    return res.status(500).json({ erro: 'Falha ao atualizar produto' })
  }
})

// DELETE
produtosRouter.delete('/produtos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ erro: 'ID inválido' })

    await prisma.produto.delete({ where: { id } })
    return res.status(204).send()
  } catch (e: any) {
    if (e?.code === 'P2025') {
      return res.status(404).send()
    }
    console.error(e)
    return res.status(500).json({ erro: 'Falha ao apagar produto' })
  }
})

export default produtosRouter