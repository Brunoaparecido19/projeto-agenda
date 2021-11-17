const Contato = require("../models/ContatoModel");
exports.index = async (req, res) => {
  const contacts = await Contato.findContacts();
  res.render("index", { contacts });
};
