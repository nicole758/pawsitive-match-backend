/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('favoriteDogs', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.string('gender').nullable();
      table.string('age').nullable();
      table.string('description').nullable();
      table.json('tags').nullable();
      table.string('photo').nullable();
    });
  };
  
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('favoriteDogs');
  };
