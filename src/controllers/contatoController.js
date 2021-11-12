const Contato = require("../models/ContatoModel");
exports.index = (req, res, next) => {
  res.render("contato",{contato:{}});
};
exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();
    if (contato.errors.length > 0) {
      req.flash("errors", contato.errors);
      req.session.save(() => res.redirect("/contato/index"));
      return;
    }
    req.flash("success", "Contato Registrado com Sucesso");
    req.session.save(() => res.redirect(`/contato/index/${contato.contato.id}`));
    return;
  } catch (error) {
    console.log(error);
    return res.render("404");
  }
};
exports.editIndex = async (req, res) => {
  const contato = await Contato.findId(req.params.id);
  if(!contato)return res.render("404");
  if (!req.params.id) return res.render("404");
  res.render("contato", { contato });
};
