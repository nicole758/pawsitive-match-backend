/**
 * One row per (user, dog) application with latest status.
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_dog_applications", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users");
    table.uuid("dog_id").notNullable().references("id").inTable("favoriteDogs");
    table.string("status", 64).notNullable();
    table.unique(["user_id", "dog_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_dog_applications");
};
