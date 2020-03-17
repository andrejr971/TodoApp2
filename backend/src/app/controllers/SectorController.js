import * as Yup from 'yup';
import Sector from '../models/Sector';
// import User from '../models/Users';

class SectorController {
  async index(req, res) {
    const sectors = await Sector.findAll({
      attributes: ['name', 'description', 'created_at'],
      include: {
        association: 'users',
        attributes: ['id', 'name', 'login'],
        through: {
          as: 'users',
          attributes: ['user_id', 'sector_id'],
        },
      },
    });

    return res.json(sectors);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { name, description } = await Sector.create(req.body);

    return res.json({ name, description });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }
    const sector = await Sector.findByPk(req.params.id);

    if (!sector) {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }

    const { id, name, description } = await sector.update(req.body);

    return res.json({ id, name, description });
  }

  async delete(req, res) {
    const sector = await Sector.findByPk(req.params.id);

    if (!sector) {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }

    sector.removeUser();
    sector.destroy();

    return res.json('Setor Deletado');
  }
}

export default new SectorController();
