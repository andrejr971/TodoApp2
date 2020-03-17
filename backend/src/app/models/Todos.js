import Sequelize, { Model } from 'sequelize';

class Todos extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        done: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Sector, { foreignKey: 'sector_id', as: 'sector' });
  }
}

export default Todos;
