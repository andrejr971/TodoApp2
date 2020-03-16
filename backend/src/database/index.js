import Sequelize from 'sequelize';

/**
 * import models
 */
import User from '../app/models/Users';
import File from '../app/models/File';
import Sector from '../app/models/Sector';

import databaseConfig from '../config/database';

const models = [User, File, Sector];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
