/**
 * Optional adoption/demo fields for favorites (see BACKEND checklist).
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable("favoriteDogs", (table) => {
    table.string("shelter_name", 255).nullable();
    table.string("area_label", 255).nullable();
    table.string("distance_label", 255).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("favoriteDogs", (table) => {
    table.dropColumn("shelter_name");
    table.dropColumn("area_label");
    table.dropColumn("distance_label");
  });
};
