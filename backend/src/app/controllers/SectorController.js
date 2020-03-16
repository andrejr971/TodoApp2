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
          as: 'main',
          attributes: ['main'],
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
}

export default new SectorController();
