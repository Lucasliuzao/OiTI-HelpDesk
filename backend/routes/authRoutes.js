// ... imports e código existente ...

router.post('/registro', async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este e-mail já está em uso'
      });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar novo usuário
    const newUser = await User.create({
      nome,
      email,
      password: hashedPassword,
      role: 'user' // Papel padrão para novos usuários
    });

    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário'
    });
  }
});

router.post('/recuperar-senha', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verificar se o email existe no banco de dados
    const user = await User.findOne({ where: { email } });
    
    // Não revelamos se o email existe ou não por questões de segurança
    // Apenas retornamos sucesso em todos os casos
    
    // Se o usuário existir, geramos um token e enviamos o email
    if (user) {
      const token = crypto.randomBytes(20).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // Token válido por 1 hora
      
      await user.update({
        resetPasswordToken: token,
        resetPasswordExpires: expires
      });
      
      // Aqui você implementaria o envio de email com o link para redefinir a senha
      // O link seria algo como: https://seusite.com/redefinir-senha?token=${token}
      
      // Exemplo de como enviar email (usando nodemailer ou outro serviço)
      // await sendEmail(email, 'Recuperação de Senha', `Clique no link para redefinir sua senha: https://seusite.com/redefinir-senha?token=${token}`);
    }
    
    // Sempre retornamos sucesso, mesmo se o email não existir
    return res.status(200).json({ 
      success: true, 
      message: 'Se o e-mail existir em nossa base, você receberá as instruções para recuperação de senha.' 
    });
    
  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar a solicitação de recuperação de senha' 
    });
  }
});

router.post('/redefinir-senha', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token e nova senha são obrigatórios' 
      });
    }
    
    // Buscar usuário pelo token
    const user = await User.findOne({ 
      where: { 
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() } // Token ainda válido
      } 
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token inválido ou expirado' 
      });
    }
    
    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Atualizar senha e limpar tokens
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Senha redefinida com sucesso' 
    });
    
  } catch (error) {
    console.error('Erro na redefinição de senha:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar a solicitação de redefinição de senha' 
    });
  }
});