module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'sector_id', {
      type: Sequelize.INTEGER,
      references: { model: 'sectors', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'main');
  },
};
