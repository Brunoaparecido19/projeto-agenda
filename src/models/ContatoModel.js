const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  tel: { type: String, required: false, default: "" },
  createIn: { type: Date, default: Date.now },
});
const ContatoModel = mongoose.model("Contato", ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}
Contato.prototype.register = async function () {
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
  return this.contato.save();
};
Contato.prototype.valida = function () {
  this.cleanUp();
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push("Email inválido");
  if (!this.body.name) this.errors.push("Nome é obrigatório");
  if (!this.body.email && !this.body.tel)
    this.errors.push("Email ou telefone deve ser preenchido");
};

Contato.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
  this.body = {
    name: this.body.name,
    lastName: this.body.lastName,
    email: this.body.email,
    tel: this.body.tel,
  };
};
Contato.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};
// Metodos estaticos

Contato.findId = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContatoModel.findById(id);
  return contact;
};
Contato.findContacts = async function () {
  const contacts = await ContatoModel.find().sort({ createIn: -1 });
  return contacts;
};
Contato.delete = async function (id) {
  if(typeof id !== "string") return;
  const contact = await ContatoModel.findByIdAndDelete(id);
  return contact;
};

module.exports = Contato;
