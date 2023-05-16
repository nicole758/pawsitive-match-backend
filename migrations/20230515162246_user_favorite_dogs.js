/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_favorite_dogs', (table) => {
      table.increments('users_favDog').primary();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('dog_id').unsigned().references('id').inTable('favoriteDogs');
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_favorite_dogs');
  
};
