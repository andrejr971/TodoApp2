module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('todos', 'sector_id', {
      type: Sequelize.INTEGER,
      references: { model: 'sectors', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('todos', 'sector_id');
  },
};
