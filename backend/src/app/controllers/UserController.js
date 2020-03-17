import * as Yup from 'yup';
import User from '../models/Users';
import File from '../models/File';
import Sector from '../models/Sector';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'name', 'login', 'avatar_id', 'administrator'],
      include: [
        { model: File, as: 'perfil', attributes: ['name', 'path', 'url'] },
        { model: Sector, as: 'main', attributes: ['id', 'name'] },
        {
          association: 'sectors',
          attributes: ['id', 'name'],
          through: { as: 'secondary', attributes: ['user_id', 'sector_id'] },
        },
      ],
    });

    return res.json(users);
  }

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
      sector: Yup.number(),
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

    const user = await User.create(req.body);

    const { id, name, email, login } = user;

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

  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      user.removeSector();
      user.destroy();

      return res.json('Usuário Deletelado');
    } catch (err) {
      return res.status(500).json({ error: `Falha: ${err}` });
    }
  }
}

export default new UserController();
