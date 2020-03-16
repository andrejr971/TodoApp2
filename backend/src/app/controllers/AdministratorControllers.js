import User from '../models/Users';
import File from '../models/File';

class AdministratorController {
  async index(req, res) {
    const users = await User.findAll({
      where: { administrator: true },
      attributes: ['id', 'name', 'login', 'avatar_id', 'administrator'],
      include: [
        { model: File, as: 'perfil', attributes: ['name', 'path', 'url'] },
      ],
    });

    return res.json(users);
  }
}

export default new AdministratorController();
