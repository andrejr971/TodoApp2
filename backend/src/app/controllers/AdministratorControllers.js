import User from '../models/Users';
import File from '../models/File';
import Sector from '../models/Sector';

class AdministratorController {
  async index(req, res) {
    const users = await User.findAll({
      where: { administrator: true },
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
}

export default new AdministratorController();
