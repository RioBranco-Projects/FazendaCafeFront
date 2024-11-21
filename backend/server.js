const express = require('express');
const cors = require('cors');
const db = require('./db/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de login
app.post('/login', (req, res) => {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
        return res.status(400).send('CPF e senha são obrigatórios.');
    }

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
            employeeId: user.id, // Retorna o ID do funcionário
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
        res.json({ total: results[0].total || 0 });
    });
});

app.get('/employees/total', (req, res) => {
    const sql = 'SELECT COUNT(*) AS total FROM employees';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar total de funcionários:', err);
            return res.status(500).send('Erro ao buscar total de funcionários.');
        }
        res.json({ total: results[0].total }); 
    });
});

app.get('/sales/total', (req, res) => {
    const sql = 'SELECT SUM(total) AS total FROM sales';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar total geral de vendas:', err);
            return res.status(500).send('Erro ao buscar total geral de vendas.');
        }

        const total = results[0].total || 0;
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

        const total = results[0].total || 0; 
        res.status(200).json({ total });
    });
});

app.post('/employees/:employeeId/plantios', (req, res) => {
    const { employeeId } = req.params;
    const { variety, plantingDate } = req.body;

    if (!variety || !plantingDate) {
        return res.status(400).send('Variedade e data de plantio são obrigatórias.');
    }

    const plantingDateObj = new Date(plantingDate);
    const estimatedHarvestDate = new Date(plantingDateObj.setMonth(plantingDateObj.getMonth() + 8));

    db.query(
        `INSERT INTO plantios (employeeId, variety, plantingDate, estimatedHarvestDate) VALUES (?, ?, ?, ?)`,
        [employeeId, variety, plantingDate, estimatedHarvestDate],
        (err) => {
            if (err) {
                console.error('Erro ao cadastrar plantio:', err);
                return res.status(500).send('Erro ao cadastrar plantio.');
            }
            res.status(201).send('Plantio cadastrado com sucesso!');
        }
    );
});

// Buscar todos os plantios
app.get('/employees/:employeeId/plantios', (req, res) => {
    const { employeeId } = req.params;

    db.query(
        `SELECT * FROM plantios WHERE employeeId = ? ORDER BY plantingDate DESC`,
        [employeeId],
        (err, results) => {
            if (err) {
                console.error('Erro ao buscar plantios:', err);
                return res.status(500).send('Erro ao buscar plantios.');
            }
            res.status(200).json(results);
        }
    );
});
app.get('/plantios/total', (req, res) => {
    const sql = 'SELECT COUNT(*) AS total FROM plantios';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar total geral de plantios:', err);
            return res.status(500).send('Erro ao buscar total geral de plantios.');
        }

        res.status(200).json(results[0]);
    });
});

// Rota para buscar o total de plantios por usuário
app.get('/employees/:employeeId/plantios/total', (req, res) => {
    const { employeeId } = req.params;
    const sql = 'SELECT COUNT(*) AS total FROM plantios WHERE employeeId = ?';

    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar total de plantios do funcionário:', err);
            return res.status(500).send('Erro ao buscar total de plantios do funcionário.');
        }

        res.status(200).json(results[0]);
    });
});
app.get('/report', async (req, res) => {
    try {
        const [totalSales] = await db.promise().query('SELECT SUM(total) AS totalSales FROM sales');
        const [totalExpenses] = await db.promise().query('SELECT SUM(amount) AS totalExpenses FROM expenses');
        const [totalPlantios] = await db.promise().query('SELECT COUNT(*) AS totalPlantios FROM plantios');
        const [totalEmployees] = await db.promise().query('SELECT COUNT(*) AS totalEmployees FROM employees');
        const [salesHistory] = await db.promise().query('SELECT id, date, client, total FROM sales ORDER BY date DESC');
        const [expensesHistory] = await db.promise().query('SELECT id, date, category, amount AS total FROM expenses ORDER BY date DESC');
        const [plantiosHistory] = await db.promise().query(`SELECT id, date type, harvest_estimate FROM plantios ORDER BY date DESC`);

        const profit = totalSales[0].totalSales - totalExpenses[0].totalExpenses;
        const profitPerEmployee = totalEmployees[0].totalEmployees > 0 ? (profit / totalEmployees[0].totalEmployees) : 0;

        res.json({
            totalSales: totalSales[0].totalSales || 0,
            totalExpenses: totalExpenses[0].totalExpenses || 0,
            profit: profit || 0,
            totalPlantios: totalPlantios[0].totalPlantios || 0,
            totalEmployees: totalEmployees[0].totalEmployees || 0,
            profitPerEmployee: profitPerEmployee || 0,
            salesHistory: salesHistory || [],
            expensesHistory: expensesHistory || [],
            plantiosHistory: plantiosHistory || [],
        });
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).send('Erro ao gerar relatório.');
    }
});
app.get('/employees/:employeeId/expenses/monthly', (req, res) => {
    const { employeeId } = req.params;

    const sql = `
    SELECT 
      DATE_FORMAT(date, '%Y-%m') AS month, 
      SUM(amount) AS totalExpenses
    FROM expenses
    WHERE employeeId = ?
    GROUP BY month
    ORDER BY month DESC
    LIMIT 2;
  `;

    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar despesas mensais:', err);
            return res.status(500).send('Erro ao buscar despesas mensais.');
        }
        res.status(200).json(results);
    });
});
// Rota para buscar vendas mensais de um funcionário
app.get('/employees/:employeeId/sales/monthly', (req, res) => {
    const { employeeId } = req.params;

    const sql = `
    SELECT 
      DATE_FORMAT(date, '%Y-%m') AS month, 
      SUM(total) AS totalSales
    FROM sales
    WHERE employeeId = ?
    GROUP BY month
    ORDER BY month DESC
    LIMIT 2;
  `;

    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar vendas mensais:', err);
            return res.status(500).send('Erro ao buscar vendas mensais.');
        }

        res.status(200).json(results);
    });
});


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
