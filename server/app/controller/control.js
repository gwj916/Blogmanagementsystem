const Controller = require('egg').Controller;

class ControlController extends Controller {
    async findcount() {
        this.ctx.body = await this.ctx.service.control.pager();
    }
}

module.exports = ControlController;