const db = require('./db/db'); // Conexão com o banco de dados

// Middleware para verificar se o usuário é admin
const isAdmin = (req, res, next) => {
    const userId = req.headers['user-id']; // Assuma que o ID do usuário é passado no cabeçalho (ou use autenticação JWT)

    if (!userId) {
        return res.status(401).send('ID do usuário não fornecido.');
    }

    const sql = 'SELECT isAdmin FROM employees WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Erro ao verificar administrador:', err);
            return res.status(500).send('Erro no servidor.');
        }

        if (results.length === 0 || results[0].isAdmin !== 1) {
            return res.status(403).send('Acesso negado: você não é administrador.');
        }

        next(); // Usuário é admin, continue com a rota
    });
};

module.exports = { isAdmin };
