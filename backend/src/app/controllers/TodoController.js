import Todos from '../models/Todos';
import Sector from '../models/Sector';
import User from '../models/Users';

class TodoController {
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

  async store(req, res) {
    const { id, description } = await Todos.create({
      description: req.body.description,
      user_id: req.userId,
      sector_id: req.body.sector,
    });

    return res.json({ id, description });
  }

  async update(req, res) {
    const todoExist = await Todos.findByPk(req.params.id);

    if (!todoExist) {
      return res.status(400).json({ error: 'Tarefa não encontrada' });
    }

    const sector = await Sector.findByPk(req.body.sector_id);

    if (!sector) {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }

    const { id, description, sector_id } = await todoExist.update(req.body);

    return res.json({ id, description, sector_id });
  }

  async show(req, res) {
    const todos = await Todos.findAll({
      where: {
        user_id: req.userId,
        sector_id: null,
      },
      attributes: ['id', 'description', 'done'],
    });

    return res.json(todos);
  }

  async delete(req, res) {
    const todo = await Todos.findByPk(req.params.id);

    if (!todo) {
      return res.status(400).json({ error: 'Tarefa não encontrada' });
    }
    todo.destroy();

    return res.json('Tarefa Deletada');
  }
}

export default new TodoController();
