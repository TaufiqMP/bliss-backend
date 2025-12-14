const AnalyticService = require("../../services/analytic-service");

exports.getTotalNasabah = async (req, res, next) => {
    try {
        const totalNasabah = await AnalyticService.getTotalNasabah();
        return res.status(200).send({
            status: 'success',
            data: {
                totalNasabah,
            },
        })
    } catch (error) {
        next(error);
    }
}

exports.getHighPriorityCustomer = async (req, res, next) => {
    try {
        const highPriorityCustomer = await AnalyticService.getHighPriorityCustomer();
        return res.status(200).send({
            status: 'success',
            data: {
                highPriorityCustomer
            }
        })
    } catch (error) {
        next(error);
    }
}