import * as Yup from 'yup';
import User from '../models/Users';
import Sector from '../models/Sector';

class AssignController {
  async store(req, res) {
    const schema = Yup.object().shape({
      sector: Yup.number().required(),
      main: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na Validação' });
    }

    const { main } = req.body;

    const sector = await Sector.findByPk(req.body.sector);

    if (!sector) {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }

    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'sector_id', 'login'],
      include: [
        {
          association: 'sectors',
          attributes: ['id', 'name'],
          through: { as: 'secondary', attributes: ['user_id', 'sector_id'] },
        },
      ],
    });

    const sector_id = req.body.sector;

    if (user.sector_id === sector_id) {
      return res
        .status(400)
        .json({ error: 'Setor já atribuido ao funcionário' });
    }

    let sectorExist = false;

    user.sectors.map(sec => {
      if (sec.id === sector_id) {
        sectorExist = true;
      }
    });

    if (sectorExist) {
      return res
        .status(400)
        .json({ error: 'Setor já atribuido ao funcionário' });
    }

    if (main === 1) {
      await user.update({
        sector_id: req.body.sector,
      });

      return res.json(user);
    }

    await user.addSector(sector.id);

    return res.json(user);
  }

  async delete(req, res) {
    const sector = await Sector.findByPk(req.params.id);
    const user = await User.findByPk(req.body.user);

    await sector.removeUser(user);

    return res.json('Desassociação com Sucesso');
  }
}

export default new AssignController();
