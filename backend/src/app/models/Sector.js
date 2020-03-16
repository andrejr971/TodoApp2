import Sequelize, { Model } from 'sequelize';

class Sector extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      foreignKey: 'sector_id',
      through: 'user_sectors',
      as: 'users',
    });
  }
}

export default Sector;
