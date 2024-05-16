const Service = require('../core/BaseService');

class ControlService extends Service {
  async pager() {
    const message = await this.ctx.model.Message.countDocuments({ blogid: null });
    const Comments = await this.ctx.model.Message.countDocuments({ blogId: { $ne: null, $exists: true } });
    const blog = await this.ctx.model.Blog.countDocuments({});
    const project = await this.ctx.model.Demo.countDocuments();
    const messagedata = {
      count: message,
      name: '留言数',
      icon: 'el-icon-copy-document'
    }
    const Commentsdata = {
      count: Comments,
      name: '评论数',
      icon: 'el-icon-edit-outline'
    }
    const blogdata = {
      count: blog,
      name: '文章数',
      icon: 'el-icon-receiving'
    }
    const projectdata = {
      count: project,
      name: '项目数',
      icon: 'el-icon-folder'
    }
    return [
      messagedata,
      Commentsdata,
      blogdata,
      projectdata
    ];
  }
  
}

module.exports = ControlService;