import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/Users';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na Validação' });
    }

    const { login, password } = req.body;

    const user = await User.findOne({
      where: { login },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não existe' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha não confere' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        login,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();