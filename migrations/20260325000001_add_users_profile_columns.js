/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("phone", 255).nullable();
    table.string("address", 512).nullable();
    table.string("city", 255).nullable();
    table.string("state", 255).nullable();
    table.string("zip", 32).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("phone");
    table.dropColumn("address");
    table.dropColumn("city");
    table.dropColumn("state");
    table.dropColumn("zip");
  });
};
