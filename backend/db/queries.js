const db = require('./db');

// Função para buscar todos os funcionários
const getAllEmployees = (callback) => {
    db.query('SELECT * FROM employees ORDER BY createdAt DESC', callback);
};

// Função para adicionar um funcionário
const addEmployee = (employee, callback) => {
    const sql = `
    INSERT INTO employees (name, position, salary, gender, address, cpfOrCnpj, admissionDate, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const params = [
        employee.name,
        employee.position,
        employee.salary,
        employee.gender,
        employee.address,
        employee.cpfOrCnpj,
        employee.admissionDate,
        employee.password, // Senha salva diretamente
    ];

    db.query(sql, params, callback);
};

// Função para excluir um funcionário
const deleteEmployee = (id, callback) => {
    const sql = 'DELETE FROM employees WHERE id = ?';
    db.query(sql, [id], callback);
};
// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
    const { id } = req.user; // Supondo que o ID do usuário esteja no token

    const sql = 'SELECT isAdmin FROM employees WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao verificar permissão:', err);
            return res.status(500).send('Erro no servidor.');
        }

        if (results.length === 0 || results[0].isAdmin !== 1) {
            return res.status(403).send('Acesso negado: você não é administrador.');
        }

        next(); // Usuário é admin, pode continuar
    });
};

module.exports = { getAllEmployees, addEmployee, deleteEmployee };
