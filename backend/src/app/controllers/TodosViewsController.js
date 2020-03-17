import Todos from '../models/Todos';
import Sector from '../models/Sector';
import User from '../models/Users';

class TodosViewsController {
  async index(req, res) {
    const user = await User.findByPk(req.userId, {
      include: [
        {
          association: 'sectors',
          attributes: ['id', 'name'],
          through: { as: 'secondary', attributes: ['user_id', 'sector_id'] },
        },
      ],
    });

    const sector = await Sector.findAll({
      where: { id: user.sector_id },
      attributes: ['id', 'name'],
      include: [
        {
          model: Todos,
          as: 'todos',
          attributes: ['id', 'description', 'done'],
        },
      ],
    });

    return res.json(sector);
  }

  async show(req, res) {
    const sector = await Sector.findByPk(req.params.id, {
      attributes: ['id', 'name'],
      include: [
        {
          model: Todos,
          as: 'todos',
          attributes: ['id', 'description', 'done'],
        },
      ],
    });

    if (!sector) {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }

    return res.json(sector);
  }
}

export default new TodosViewsController();
