import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Rosane19',
    database: 'bdd_sa',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(cors());
app.use(express.json());

// --- Rotas de usuários ---
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

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
        res.status(500).json({ error: 'Erro ao adicionar usuário' });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
        if (rows.length === 0) return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        res.status(200).json({ message: 'Login bem-sucedido', user: rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// --- Rotas de alimentos ---
app.get('/alimentos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM alimentos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar alimentos' });
    }
});

app.post('/alimentos', async (req, res) => {
    const { nome, categoria, gramas, calorias, proteinas, carboidratos, gorduras, contem_gluten, contem_lactose } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO alimentos (nome, categoria, gramas, calorias, proteinas, carboidratos, gorduras, contem_gluten, contem_lactose) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, categoria, gramas, calorias, proteinas, carboidratos, gorduras, contem_gluten, contem_lactose]
        );
        res.status(201).json({ id_alimento: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao inserir alimento' });
    }
});

// --- Rotas de planos ---
app.post('/planos', async (req, res) => {
    const { id_usuario, idade, sexo, altura, peso, objetivo, atividade, condicoes, alergias } = req.body;
    try {
        const alturaM = altura / 100;
        const imc = (peso / (alturaM * alturaM));

        let tmb;
        if (sexo === 'Masculino') {
            tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
        } else {
            tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
        }

        const fatores = {
            'Sedentário': 1.2,
            'Levemente ativo': 1.375,
            'Moderadamente ativo': 1.55,
            'Altamente ativo': 1.725
        };

        let calorias = Math.round(tmb * (fatores[atividade] || 1.2));
        if (objetivo === 'Perder Peso') calorias -= 500;
        else if (objetivo === 'Ganho de massa magra') calorias += 500;

        const [result] = await pool.query(
            `INSERT INTO planos (id_usuario, idade, sexo, altura, peso, objetivo, atividade, condicoes, alergias, imc, calorias) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_usuario, idade, sexo, altura, peso, objetivo, atividade, condicoes, alergias, imc, calorias]
        );

        const cardapio = await gerarCardapioAutomatico(objetivo, alergias, calorias);

        res.status(201).json({
            mensagem: 'Plano salvo com sucesso!',
            plano: { id_plano: result.insertId, imc, calorias },
            cardapio
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar plano' });
    }
});

app.get('/planos/:id_usuario', async (req, res) => {
    try {
        const [plano] = await pool.query('SELECT * FROM planos WHERE id_usuario = ? ORDER BY id_plano DESC LIMIT 1', [req.params.id_usuario]);
        if (plano.length === 0) return res.status(404).json({ error: 'Nenhum plano encontrado' });

        const [alimentos] = await pool.query('SELECT * FROM alimentos');

        const resposta = {
            ...plano[0],
            alimentos,
            cardapio: await gerarCardapioAutomatico(plano[0].objetivo, plano[0].alergias, plano[0].calorias)
        };

        res.json(resposta);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar plano' });
    }
});

// --- Geração de cardápio ---
async function gerarCardapioAutomatico(objetivo, alergias, caloriasDiarias) {
    try {
        let filtroAlergias = '';
        if (alergias === 'Glúten') filtroAlergias = 'AND contem_gluten = 0';
        else if (alergias === 'Lactose') filtroAlergias = 'AND contem_lactose = 0';
        else if (alergias === 'Ambos') filtroAlergias = 'AND contem_gluten = 0 AND contem_lactose = 0';

        const [alimentos] = await pool.query(`SELECT * FROM alimentos WHERE 1=1 ${filtroAlergias}`);

        const categorias = {
            cafeCarboidratos: alimentos.filter(a => a.categoria === 'carboidrato' && !['arroz integral', 'arroz branco', 'macarrão', 'pão francês', 'feijão carioca', 'feijão preto', 'mandioca cozida', 'cuscuz'].includes(a.nome.toLowerCase())),
            cafeProteinas: alimentos.filter(a => a.categoria === 'proteina' && !['peito de frango grelhado', 'salmão grelhado', 'tilápia grelhada', 'carne moída bovina (cozida)', 'hambúrguer caseiro', 'omelete simples'].includes(a.nome.toLowerCase())),
            frutas: alimentos.filter(a => a.categoria.includes('fruta')),
            almocoProteinas: alimentos.filter(a => a.categoria.includes('proteina')),
            almocoCarboidratos: alimentos.filter(a => a.categoria.includes('carboidrato')),
            vegetais: alimentos.filter(a => ['vegetal', 'legume', 'leguminosa'].includes(a.categoria))
        };

        const cardapio = { cafeDaManha: [], almoco: [], jantar: [] };

        cardapio.cafeDaManha.push(selecionarAlimento(categorias.cafeCarboidratos, objetivo, 'carboidrato'));
        cardapio.cafeDaManha.push(selecionarAlimento(categorias.cafeProteinas, objetivo, 'proteina'));
        cardapio.cafeDaManha.push(selecionarAlimento(categorias.frutas, objetivo, 'fruta'));

        cardapio.almoco.push(selecionarAlimento(categorias.almocoProteinas, objetivo, 'proteina'));
        cardapio.almoco.push(selecionarAlimento(categorias.almocoCarboidratos, objetivo, 'carboidrato'));
        cardapio.almoco.push(selecionarAlimento(categorias.vegetais, objetivo, 'legume'));

        cardapio.jantar.push(selecionarAlimento(categorias.almocoProteinas, objetivo, 'proteina'));
        cardapio.jantar.push(selecionarAlimento(categorias.vegetais, objetivo, 'legume'));

        return cardapio;
    } catch (err) {
        console.error('Erro ao gerar cardápio:', err);
        return null;
    }
}

function selecionarAlimento(lista, objetivo, categoria) {
    if (!lista || lista.length === 0) return null;

    const alimento = lista[Math.floor(Math.random() * lista.length)];

    const ranges = {
        carboidrato: objetivo === 'Ganho de massa magra' ? [80, 120] : [40, 80],
        proteina: objetivo === 'Ganho de massa magra' ? [100, 150] : [60, 100],
        gordura: [10, 30],
        fruta: [50, 150],
        legume: [60, 120],
        oleaginosa: [10, 30]
    };

    const [min, max] = ranges[categoria] || [50, 100];
    const quantidade = Math.floor(Math.random() * (max - min + 1)) + min;

    const gramasBase = alimento.gramas > 0 ? alimento.gramas : 100;
    const fator = quantidade / gramasBase;

    return {
        id: alimento.id_alimento,
        nome: alimento.nome,
        categoria: alimento.categoria,
        gramas: gramasBase,
        quantidade,
        calorias: alimento.calorias * fator,
        proteinas: alimento.proteinas * fator,
        carboidratos: alimento.carboidratos * fator,
        gorduras: alimento.gorduras * fator
    };
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});