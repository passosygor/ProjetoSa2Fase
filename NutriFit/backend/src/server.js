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

// 🔽 COMANDOS PARA ENVIAR OS DADOS DO INPUT PARA O BDD
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// 🔽 GET usuário por ID
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

// 🔽 POST (cadastrar novo usuário)
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



// 🔽 PUT (atualizar usuário)
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


// 🔽 DELETE (remover usuário)
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




// BANCO DE DADOS PARA ARMAZENAMENTO DE ALIMENTO

// GET todos os alimentos
// app.get('/alimentos', async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       'SELECT id_alimento, nome, gramas, calorias, proteinas, carboidratos, gorduras FROM alimentos ORDER BY id_alimento DESC'
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error('Erro ao buscar alimentos:', err);
//     res.status(500).json({ error: 'Erro ao buscar alimentos' });
//   }
// });

// POST para cadastrar novo alimento
app.post('/alimentos', async (req, res) => {
  const { nome, gramas, calorias, proteinas, carboidratos, gorduras } = req.body;

  if (!nome || gramas == null || calorias == null) {
    return res.status(400).json({ error: 'Campos faltando (nome, gramas, calorias)' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO alimentos (nome, gramas, calorias, proteinas, carboidratos, gorduras) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, gramas, calorias, proteinas, carboidratos, gorduras]
    );
    const novoAlimento = {
      id_alimento: resultado.insertId,
      nome,
      gramas,
      calorias,
      proteinas,
      carboidratos,
      gorduras
    };
    res.status(201).json(novoAlimento);
  } catch (err) {
    console.error('Erro ao inserir alimento:', err);
    res.status(500).json({ error: 'Erro ao inserir alimento' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// 🔽 DELETE (remover alimento)
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
        res.status(500).json({ error: 'Erro ao deletar Alimento' });
    }
});

app.get('/alimentos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alimentos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar alimentos' });
  }
});





//BANCO DE DADOS DO QUIZ

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
    alergias,
    imc,
    calorias
  } = req.body;

  console.log('REQ BODY:', req.body);

  const sql = `
    INSERT INTO planos (
      id_usuario, idade, sexo, altura, peso,
      objetivo, atividade, condicoes, alergias,
      imc, calorias
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
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
  ];

  try {
    const [result] = await pool.query(sql, values);
    res.status(201).json({ mensagem: 'Plano salvo com sucesso!' });
  } catch (err) {
    console.error('Erro ao inserir plano:', err);
    res.status(500).json({ erro: 'Erro ao salvar plano' });
  }
});




// TESTE

app.get('/planos/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [resultado] = await pool.query(
      'SELECT * FROM planos WHERE id_usuario = ? ORDER BY id_plano DESC LIMIT 1',
      [id]
    );

    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Plano não encontrado' });
    }

    const plano = resultado[0];

    // Aqui você pode criar regras simples baseadas no objetivo:
    let planoAlimentar;

    if (plano.objetivo === 'Ganho de massa magra') {
      planoAlimentar = {
        objetivo: plano.objetivo,
        cardapio: [
          {
            refeicao: 'Café da manhã',
            descricao: '60 g de aveia, 1 scoop whey, banana, leite...',
            calorias: 660,
            proteinas: 41,
            carboidratos: 83,
            gorduras: 18
          },
          {
            refeicao: 'Almoço',
            descricao: 'Peito de frango, arroz, batata doce...',
            calorias: 1320,
            proteinas: 83,
            carboidratos: 165,
            gorduras: 36
          },
          // Adicione mais refeições aqui
        ]
      };
    } else if (plano.objetivo === 'Perder Peso') {
      planoAlimentar = {
        objetivo: plano.objetivo,
        cardapio: [
          {
            refeicao: 'Café da manhã',
            descricao: 'Iogurte natural, morango, chia...',
            calorias: 300,
            proteinas: 20,
            carboidratos: 25,
            gorduras: 8
          },
          {
            refeicao: 'Jantar',
            descricao: 'Peixe grelhado, legumes, salada...',
            calorias: 500,
            proteinas: 35,
            carboidratos: 30,
            gorduras: 12
          },
        ]
      };
    } else {
      planoAlimentar = {
        objetivo: plano.objetivo,
        cardapio: [
          {
            refeicao: 'Almoço padrão',
            descricao: 'Arroz, feijão, carne magra, legumes',
            calorias: 600,
            proteinas: 40,
            carboidratos: 60,
            gorduras: 15
          }
        ]
      };
    }

    res.status(200).json(planoAlimentar);

  } catch (err) {
    console.error('Erro ao buscar plano alimentar:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});
