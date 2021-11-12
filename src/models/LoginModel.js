const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  nameUser: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);
class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }
  async login() {
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.errors.push("Usuário não existe");
      return;
    }
    if (!bcrypt.compareSync(this.body.password, this.user.password)) {
      this.errors.push("Senha incorreta");
      this.user = null;
      return;
    }
  }
  async register() {
    this.isValidName();
    this.valida();
    if (this.errors.length > 0) return;
    await this.userExists();
    if (this.errors.length > 0) return;
    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);
    this.user = await LoginModel.create(this.body);
  }
  async userExists() {
    try {
      this.user = await LoginModel.findOne({ email: this.body.email });
      if (this.user) this.errors.push("E-mail já cadrastrado");
    } catch (error) {
      console.log(error);
    }
  }
  isValidName() {
    if (this.body.nameUser.length < 4 || this.body.nameUser.length >= 20)
      this.errors.push("O nome precisa ter entre 4 a 20 carácteres");
    if (this.body.nameUser.length === 0)
      this.errors.push("O nome não pode ser vazio");
    if (!this.body.nameUser.match(/^[a-zA-Z ]+$/))
      this.errors.push("O nome deve conter apenas letras");
    if (this.body.nameUser.match(/([a-zA-Z])\1/))
      this.errors.push("O nome não pode conter letras repetidas");
  }
  valida() {
    this.cleanUp();
    if (!validator.isEmail(this.body.email)) this.errors.push("Email inválido");
    if (this.body.password.length < 6 || this.body.password.length >= 30)
      this.errors.push("A senha precisa ter entre 6 a 30 carácteres");
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password,
      nameUser: this.body.nameUser,
    };
  }
}

module.exports = Login;
