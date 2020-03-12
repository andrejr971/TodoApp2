import * as Yup from 'yup';
import User from '../models/Users';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      login: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na Validação' });
    }

    const userExist = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExist) {
      return res.status(400).json({ error: 'E-mail já exite' });
    }

    const userLoginExist = await User.findOne({
      where: { login: req.body.login },
    });

    if (userLoginExist) {
      return res.status(400).json({ error: 'Login já exite' });
    }

    const { id, name, email, login } = await User.create(req.body);

    return res.json({ id, name, email, login });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      login: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na Validação' });
    }

    const { login, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (login !== user.login) {
      const userLoginExist = await User.findOne({
        where: { login },
      });

      if (userLoginExist) {
        return res.status(400).json({ error: 'Login já exite' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha não confere' });
    }

    try {
      const { id, name, email } = await user.update(req.body);
      return res.json({ id, name, email, login });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
}

export default new UserController();
