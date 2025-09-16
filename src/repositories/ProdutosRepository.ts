import Produto from '../models/Produto';
import database from './database'

const ProdutosRepository = {
	criar: (produto: Produto, callback: (id?: number) => void) => {
		const sql = 'INSERT INTO produtos (nome, fotoUrl, preco) VALUES (?, ?, ?)'
		console.log(sql)
		const params = [produto.nome, produto.fotoUrl, produto.preco]
		database.run(sql, params, function(_err) {
			callback(this?.lastID)
		})
	},

	lerTodos: (callback: (produtos: Produto[]) => void) => {
		const sql = 'SELECT * FROM produtos'
		const params: any[] = []
		database.all(sql, params, (_err, rows: any[]) => {
			const produtos: Produto[] = rows.map((row: any) => ({
				id: row.id,
				nome: row.nome,
				fotoUrl: row.fotoUrl,
				preco: row.preco,
			}));
			callback(produtos);
		})
	},

	ler: (id: number, callback: (produto?: Produto) => void) => {
		const sql = 'SELECT * FROM produtos WHERE id = ?'
		const params = [id]
		database.get(sql, params, (_err, row: any) => {
			if (!row) {
				callback(undefined);
				return;
			}
			const produto: Produto = {
				id: row.id,
				nome: row.nome,
				fotoUrl: row.fotoUrl,
				preco: row.preco,
			};
			callback(produto);
		})
	},

	atualizar: (id: number, produto: Produto, callback: (notFound: boolean) => void) => {
		const sql = 'UPDATE produtos SET nome = ?, fotoUrl = ?, preco = ? WHERE id = ?'
		const params = [produto.nome, produto.fotoUrl, produto.preco, id]
		database.run(sql, params, function(_err) {
			callback(this.changes === 0)
		})
	},

	apagar: (id: number, callback: (notFound: boolean) => void) => {
		const sql = 'DELETE FROM produtos WHERE id = ?'
		const params = [id]
		database.run(sql, params, function(_err) {
			callback(this.changes === 0)
		})
	},
}

export default ProdutosRepository