const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const { isAdmin } = require('./middlewares'); // Importa o middleware

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de login
app.post('/login', (req, res) => {
    const { cpf, password } = req.body;

    const sql = 'SELECT * FROM employees WHERE cpfOrCnpj = ? AND password = ?';
    db.query(sql, [cpf, password], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro no servidor.');
        }

        if (results.length === 0) {
            return res.status(401).send('Usuário ou senha inválidos.');
        }

        const user = results[0];
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: {
                id: user.id,
                name: user.name,
                isAdmin: user.isAdmin,
            },
        });
    });
});

// Rota para buscar todos os funcionários
app.get('/employees', (req, res) => {
    db.query('SELECT * FROM employees ORDER BY createdAt DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar funcionários:', err);
            return res.status(500).send('Erro ao buscar funcionários.');
        }
        res.status(200).json(results);
    });
});

// Rota para adicionar um funcionário
app.post('/employees', (req, res) => {
    const { name, position, salary, gender, address, cpfOrCnpj, admissionDate, password } = req.body;

    if (!name || !cpfOrCnpj || !password) {
        return res.status(400).send('Os campos "name", "cpfOrCnpj" e "password" são obrigatórios.');
    }

    const sql = `
    INSERT INTO employees (name, position, salary, gender, address, cpfOrCnpj, admissionDate, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [name, position, salary, gender, address, cpfOrCnpj, admissionDate, password];

    db.query(sql, params, (err) => {
        if (err) {
            console.error('Erro ao adicionar funcionário:', err);
            return res.status(500).send('Erro ao adicionar funcionário.');
        }
        res.status(201).send('Funcionário adicionado com sucesso!');
    });
});

// Rota para excluir um funcionário
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Erro ao excluir funcionário:', err);
            return res.status(500).send('Erro ao excluir funcionário.');
        }
        res.status(200).send('Funcionário excluído com sucesso!');
    });
});

app.get('/verify-auth', (req, res) => {
    // Simula uma validação de sessão no backend
    const isAuthenticated = true; // Substitua com a lógica real de validação

    if (isAuthenticated) {
        res.status(200).send('Usuário autenticado.');
    } else {
        res.status(401).send('Usuário não autenticado.');
    }
});

app.get('/employees/:cpf', (req, res) => {
    const { cpf } = req.params;

    const sql = 'SELECT name FROM employees WHERE cpfOrCnpj = ?';
    db.query(sql, [cpf], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro no servidor.');
        }

        if (results.length === 0) {
            return res.status(404).send('Usuário não encontrado.');
        }

        res.status(200).json(results[0]); // Retorna o nome do usuário
    });
});

// Rota para adicionar uma venda associada a um funcionário
app.post('/employees/:employeeId/sales', (req, res) => {
    const { employeeId } = req.params;
    const { date, number, client, status, total, invoice } = req.body;

    if (!date || !number || !client || !status || !total || !invoice) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const sql = `
        INSERT INTO sales (employeeId, date, number, client, status, total, invoice)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [employeeId, date, number, client, status, total, invoice], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar venda:', err);
            return res.status(500).send('Erro ao adicionar venda.');
        }
        res.status(201).send('Venda adicionada com sucesso!');
    });
});
// Rota para listar todas as vendas de um funcionário
app.get('/employees/:employeeId/sales', (req, res) => {
    const { employeeId } = req.params;

    const sql = 'SELECT * FROM sales WHERE employeeId = ? ORDER BY date DESC';
    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar vendas:', err);
            return res.status(500).send('Erro ao buscar vendas.');
        }
        res.status(200).json(results);
    });
});
// Rota para adicionar uma despesa associada a um funcionário
app.post('/employees/:employeeId/expenses', (req, res) => {
    const { employeeId } = req.params;
    const { date, category, description, amount } = req.body;

    if (!date || !category || !description || !amount) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const sql = `
        INSERT INTO expenses (employeeId, date, category, description, amount)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [employeeId, date, category, description, amount], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar despesa:', err);
            return res.status(500).send('Erro ao adicionar despesa.');
        }
        res.status(201).send('Despesa adicionada com sucesso!');
    });
});

// Rota para listar todas as despesas de um funcionário
app.get('/employees/:employeeId/expenses', (req, res) => {
    const { employeeId } = req.params;

    const sql = 'SELECT * FROM expenses WHERE employeeId = ? ORDER BY date DESC';
    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar despesas:', err);
            return res.status(500).send('Erro ao buscar despesas.');
        }
        res.status(200).json(results);
    });
});
// Total de vendas por usuário
app.get('/employees/:employeeId/sales/total', (req, res) => {
    const { employeeId } = req.params;

    const sql = 'SELECT SUM(total) AS total FROM sales WHERE employeeId = ?';
    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar total de vendas por usuário:', err);
            return res.status(500).send('Erro ao buscar total de vendas por usuário.');
        }
        res.json({ total: results[0].total || 0 });
    });
});

// Total de despesas por usuário
app.get('/employees/:employeeId/expenses/total', (req, res) => {
    const { employeeId } = req.params;

    const sql = 'SELECT SUM(amount) AS total FROM expenses WHERE employeeId = ?';
    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar total de despesas por usuário:', err);
            return res.status(500).send('Erro ao buscar total de despesas por usuário.');
        }
        res.json({ total: results[0].total || 0 }); // Retorna 0 se não houver despesas
    });
});

app.get('/employees/total', (req, res) => {
    const sql = 'SELECT COUNT(*) AS total FROM employees';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar total de funcionários:', err);
            return res.status(500).send('Erro ao buscar total de funcionários.');
        }
        res.json({ total: results[0].total }); // Retorna o total de funcionários
    });
});
// ------------------------------------------GERAL-----------------------
app.get('/sales/total', (req, res) => {
    const sql = 'SELECT SUM(total) AS total FROM sales';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar total geral de vendas:', err);
            return res.status(500).send('Erro ao buscar total geral de vendas.');
        }

        const total = results[0].total || 0; // Retorna 0 se não houver vendas
        res.status(200).json({ total });
    });
});
app.get('/expenses/total', (req, res) => {
    const sql = 'SELECT SUM(amount) AS total FROM expenses';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar total geral de despesas:', err);
            return res.status(500).send('Erro ao buscar total geral de despesas.');
        }

        const total = results[0].total || 0; // Retorna 0 se não houver despesas
        res.status(200).json({ total });
    });
});

// Rota restrita para listar todos os usuários (admin somente)
app.get('/admin/employees', isAdmin, (req, res) => {
    const sql = 'SELECT * FROM employees ORDER BY createdAt DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).send('Erro ao buscar usuários.');
        }
        res.status(200).json(results);
    });
});

// Rota para excluir usuário (admin somente)
app.delete('/admin/employees/:id', isAdmin, (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM employees WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return res.status(500).send('Erro ao excluir usuário.');
        }
        res.status(200).send('Usuário excluído com sucesso!');
    });
});

// Rota para excluir vendas (admin somente)
app.delete('/admin/sales/:id', isAdmin, (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM sales WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Erro ao excluir venda:', err);
            return res.status(500).send('Erro ao excluir venda.');
        }
        res.status(200).send('Venda excluída com sucesso!');
    });
});

// Rota para excluir despesas (admin somente)
app.delete('/admin/expenses/:id', isAdmin, (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM expenses WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Erro ao excluir despesa:', err);
            return res.status(500).send('Erro ao excluir despesa.');
        }
        res.status(200).send('Despesa excluída com sucesso!');
    });
});
// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
