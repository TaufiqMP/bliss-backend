const NasabahService = require("../../services/nasabah-service");

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;

    const data = await NasabahService.getAll({
      page,
      limit,
      status,
      priority,
    });

    res.json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getSpecificSales = async (req, res) => {
  try {
    const { user_id } = req.body;
    const data = await NasabahService.getSpecificSales(user_id);

    res.json({ status: "success", data });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
}

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await NasabahService.getById(id);

    res.json({ status: "success", data });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updated = await NasabahService.update(id, payload);

    res.json({ status: "success", data: updated });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteNasabah = async (req, res) => {
  try {
    const { id } = req.params;

    await NasabahService.deleteNasabah(id);

    res.json({ status: "success", message: "Nasabah deleted" });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getCountsByUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    const openCount = await NasabahService.countOpenByUser(user_id);
    const closedCount = await NasabahService.countClosedByUser(user_id);

    res.json({
      status: "success",
      data: { openCount, closedCount },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
