import sqlite3 from 'sqlite3'

const DBSOURCE = 'db.sqlite'

const SQL_PRODUTOS_CREATE = `
	CREATE TABLE produtos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		nome TEXT,
		fotoUrl TEXT,
		preco REAL
	)`

const database = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
		console.error(err.message)
		throw err
	} else {
		console.log('Base de dados conectada com sucesso.')
		database.run(SQL_PRODUTOS_CREATE, (err) => {
		if (err) {
			// Possivelmente a tabela já foi criada
		} else {
			console.log('Tabela produtos criada com sucesso.')
		}
	})
	}
})

export default database