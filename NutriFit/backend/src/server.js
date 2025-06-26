import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'senai',
    database: 'bdd_sa',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(cors());
app.use(express.json());

// COMANDOS PARA ENVIAR OS DADOS DO INPUT PARA O BDD
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// COMANDO GET USUARIO POR ID
app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

//POST (Cadastrar novo usuário)
app.post('/usuarios', async (req, res) => {
    const { usuario, senha, email } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO usuarios (usuario, senha, email) VALUES (?, ?, ?)',
            [usuario, senha, email]
        );
        const [novoUsuario] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [result.insertId]);
        res.status(201).json(novoUsuario[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar usuário' });
    }
});

//PUT(Atualizar usuário)
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;    
    const { usuario, senha, email } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE usuarios SET usuario = ?, senha = ?, email = ? WHERE id_usuario = ?',
            [usuario, senha, email, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const [usuarioAtualizado] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        res.json(usuarioAtualizado[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

//DELETE (Remover usuário)
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }
        res.status(200).json({ message: 'Login bem-sucedido', user: rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// ROTAS DE ALIMENTOS
app.get('/alimentos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM alimentos');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar alimentos' });
    }
});

//CADASTRAR ALIMENTO
app.post('/alimentos', async (req, res) => {
    const { nome, categoria, gramas, calorias, proteinas, carboidratos, gorduras, contem_gluten, contem_lactose } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO alimentos 
             (nome, categoria, gramas, calorias, proteinas, carboidratos, gorduras, contem_gluten, contem_lactose) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, categoria, gramas, calorias, proteinas, carboidratos, gorduras, contem_gluten, contem_lactose]
        );
        const novoAlimento = {
            id_alimento: result.insertId,
            ...req.body
        };
        res.status(201).json(novoAlimento);
    } catch (err) {
        console.error('Erro ao inserir alimento:', err);
        res.status(500).json({ error: 'Erro ao inserir alimento' });
    }
});

//DELETE(Remover alimento)
app.delete('/alimentos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM alimentos WHERE id_alimento = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Alimento não encontrado' });
        }
        res.json({ message: 'Alimento deletado com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar alimento' });
    }
});

// ROTAS DE PLANOS ALIMENTARES
app.post('/planos', async (req, res) => {
    const {
        id_usuario,
        idade,
        sexo,
        altura,
        peso,
        objetivo,
        atividade,
        condicoes,
        alergias
    } = req.body;

    try {
        // Cálculos automáticos
        const alturaM = altura / 100;
        const imc = (peso / (alturaM * alturaM)).toFixed(2);
        
        // Cálculo de calorias baseado em Harris-Benedict
        let tmb;
        if (sexo === 'Masculino') {
            tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
        } else {
            tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
        }

        // Fator de atividade
        const fatores = {
            'Sedentário': 1.2,
            'Levemente ativo': 1.375,
            'Moderadamente ativo': 1.55,
            'Altamente ativo': 1.725
        };
        
        let calorias = Math.round(tmb * (fatores[atividade] || 1.2));

        // Ajuste para objetivo
        if (objetivo === 'Perder Peso') calorias -= 500;
        else if (objetivo === 'Ganho de massa magra') calorias += 500;

        // Inserir no banco
        const [result] = await pool.query(
            `INSERT INTO planos (
                id_usuario, idade, sexo, altura, peso,
                objetivo, atividade, condicoes, alergias,
                imc, calorias
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_usuario,
                idade,
                sexo,
                altura,
                peso,
                objetivo,
                atividade,
                condicoes,
                alergias,
                imc,
                calorias
            ]
        );

        // Gerar cardápio automático
        const cardapio = await gerarCardapioAutomatico(objetivo, alergias, calorias);
        
        res.status(201).json({ 
            mensagem: 'Plano salvo com sucesso!',
            plano: {
                id_plano: result.insertId,
                imc,
                calorias
            },
            cardapio
        });

    } catch (err) {
        console.error('Erro ao inserir plano:', err);
        res.status(500).json({ erro: 'Erro ao salvar plano' });
    }
});

app.get('/planos/:id_usuario', async (req, res) => {
    try {
        // Busca o plano mais recente do usuário
        const [plano] = await pool.query(
            'SELECT * FROM planos WHERE id_usuario = ? ORDER BY id_plano DESC LIMIT 1',
            [req.params.id_usuario]
        );

        if (plano.length === 0) {
            return res.status(404).json({ erro: 'Nenhum plano encontrado' });
        }

        // Busca alimentos do banco
        const [alimentos] = await pool.query('SELECT * FROM alimentos');

        // Formata resposta
        const resposta = {
            ...plano[0],
            alimentos, // Envia todos os alimentos disponíveis
            cardapio: await gerarCardapioAutomatico(
                plano[0].objetivo,
                plano[0].alergias,
                plano[0].calorias
            )
        };

        res.json(resposta);
    } catch (err) {
        console.error('Erro ao buscar plano:', err);
        res.status(500).json({ erro: 'Erro interno' });
    }
});

// Função auxiliar para gerar cardápio automático
async function gerarCardapioAutomatico(objetivo, alergias, caloriasDiarias) {
    try {
        // Filtros para alergias
        let filtroAlergias = '';
        if (alergias === 'Glúten') filtroAlergias = 'AND contem_gluten = FALSE';
        else if (alergias === 'Lactose') filtroAlergias = 'AND contem_lactose = FALSE';

        // Consulta alimentos permitidos
        const [alimentos] = await pool.query(
            `SELECT * FROM alimentos WHERE 1=1 ${filtroAlergias}`
        );

        // Agrupa por categoria
        const categorias = {
            carboidratos: alimentos.filter(a => a.categoria === 'carboidrato'),
            proteinas: alimentos.filter(a => a.categoria === 'proteina'),
            frutas: alimentos.filter(a => a.categoria === 'fruta'),
            vegetais: alimentos.filter(a => a.categoria === 'vegetal'),
            gorduras: alimentos.filter(a => a.categoria === 'gordura')
        };

        // Gera cardápio baseado no objetivo
        if (objetivo === 'Ganho de massa magra') {
            return {
                cafeDaManha: [
                    selecionarAlimento(categorias.carboidratos, 60),
                    selecionarAlimento(categorias.proteinas, 30),
                    selecionarAlimento(categorias.frutas, 1)
                ],
                almoco: [
                    selecionarAlimento(categorias.proteinas, 150),
                    selecionarAlimento(categorias.carboidratos, 100),
                    selecionarAlimento(categorias.vegetais, 100)
                ],
                jantar: [
                    selecionarAlimento(categorias.proteinas, 120),
                    selecionarAlimento(categorias.carboidratos, 80),
                    selecionarAlimento(categorias.vegetais, 100)
                ]
            };
        } else { // Perda de peso
            return {
                cafeDaManha: [
                    selecionarAlimento(categorias.proteinas, 40),
                    selecionarAlimento(categorias.frutas, 1)
                ],
                almoco: [
                    selecionarAlimento(categorias.proteinas, 120),
                    selecionarAlimento(categorias.vegetais, 200)
                ],
                jantar: [
                    selecionarAlimento(categorias.proteinas, 100),
                    selecionarAlimento(categorias.vegetais, 150)
                ]
            };
        }
    } catch (err) {
        console.error('Erro ao gerar cardápio:', err);
        return null;
    }
}

function selecionarAlimento(lista, quantidade) {
    if (!lista || lista.length === 0) return null;
    const alimento = lista[Math.floor(Math.random() * lista.length)];
    return {
        ...alimento,
        quantidade
    };
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});