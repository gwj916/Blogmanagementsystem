const { static } = require('../../config/config.default');
const Service = require('../core/BaseService');
const toc = require('markdown-toc');
class BlogService extends Service {
  async blogTypeIdExists(info) {
    if (info.categoryId) {
      const type = await this.ctx.model.BlogType.findById(info.categoryId);
      if (!type) {
        this.throw(406, 'categoryId not exists');
      }
    }
  }

  async find(id) {
    return await this.ctx.model.Blog.findById(id).populate('categoryId');
  }

  async increaseScanNumber(id) {
    await this.ctx.model.Blog.updateOne(
      { _id: id },
      { $inc: { scanNumber: 1 } }
    );
  }

  handleTOC(info) {
    var result = toc(info.markdownContent).json;
    function transfer(flatArr) {
      const stack = [];
      const result = [];

      var min = 6;
      for (var i of flatArr) {
        if (i.lvl < min) {
          min = i.lvl;
        }
      }

      for (const item of flatArr) {
        const tocItem = createTOCItem(item);
        if (tocItem.level === min) {
          result.push(tocItem);
        }
        handleItem(tocItem);
      }
      return result;
      function createTOCItem(item) {
        return {
          name: item.content,
          anchor: item.slug,
          level: item.lvl,
          children: [],
        };
      }

      function handleItem(item) {
        const top = stack[stack.length - 1];
        if (!top) {
          stack.push(item);
        } else if (item.level > top.level) {
          // 作为其子目录
          top.children.push(item);
          stack.push(item);
        } else {
          stack.pop();
          handleItem(item);
        }
      }
    }

    info.toc = transfer(result);

    delete info.markdownContent;

    // 为各个级别标题添加上 id
    for (var i of result) {
      switch (i.lvl) {
        case 1: {
          var newStr = `<h1 id="${i.slug}">`
          info.htmlContent = info.htmlContent.replace('<h1>', newStr);
          break;
        }
        case 2: {
          var newStr = `<h2 id="${i.slug}">`
          info.htmlContent = info.htmlContent.replace('<h2>', newStr);
          break;
        }
        case 3: {
          var newStr = `<h3 id="${i.slug}">`
          info.htmlContent = info.htmlContent.replace('<h3>', newStr);
          break;
        }
        case 4: {
          var newStr = `<h4 id="${i.slug}">`
          info.htmlContent = info.htmlContent.replace('<h4>', newStr);
          break;
        }
        case 5: {
          var newStr = `<h5 id="${i.slug}">`
          info.htmlContent = info.htmlContent.replace('<h5>', newStr);
          break;
        }
        case 6: {
          var newStr = `<h6 id="${i.slug}">`
          info.htmlContent = info.htmlContent.replace('<h6>', newStr);
          break;
        }
      }
    }

    return info;
  }

  async add(info) {
    info = this.handleTOC(info);

    this.validate(
      {
        title: 'string',
        categoryId: 'string',
        description: {
          type: 'string',
          allowEmpty: true,
        },
        createDate: 'int?',
        toc: 'array',
        htmlContent: 'string',
        thumb: {
          type: 'string',
          required: true,
          allowEmpty: true,
        },
      },
      info
    );
    info.thumb = info.thumb || '';
    info.scanNumber = 0;
    info.commentNumber = 0;
    info.createDate = info.createDate || Date.now();
    await this.blogTypeIdExists(info);
    const obj = await this.ctx.model.Blog.create(info);
    await this.ctx.model.BlogType.updateOne(
      { _id: obj.categoryId },
      { $inc: { articleCount: 1 } }
    );
    return await this.find(obj._id);
  }

  async update(id, info) {
    info = this.handleTOC(info);

    const blog = await this.ctx.model.Blog.findById(id);
    if (!blog) {
      return null;
    }
    this.validate(
      {
        title: 'string',
        categoryId: 'string',
        description: {
          type: 'string',
          allowEmpty: true,
        },
        createDate: 'int',
        toc: 'array',
        htmlContent: 'string',
        thumb: {
          type: 'string',
          required: true,
          allowEmpty: true,
        },
      },
      info
    );
    await this.blogTypeIdExists(info.categoryId);
    // 处理类型
    if (blog.categoryId) {
      // 之前的类别文章数量-1
      await this.ctx.model.BlogType.updateOne(
        { _id: blog.categoryId },
        { $inc: { articleCount: -1 } }
      );
    }
    // 当前类别的文章数量+1
    await this.ctx.model.BlogType.updateOne(
      { _id: info.categoryId },
      { $inc: { articleCount: 1 } }
    );
    await this.ctx.model.Blog.updateOne({ _id: id }, { $set: info });
    return await this.find(id);
  }

  async remove(id) {
    const blog = await this.ctx.model.Blog.findById(id);
    if (blog) {
      if (blog.categoryId) {
        // 修改blogtype的文章数量
        await this.ctx.model.BlogType.updateOne(
          { _id: blog.categoryId },
          { $inc: { articleCount: -1 } }
        );
      }
      // 删除分类下的所有评论
      await this.ctx.model.Message.remove({ blogId: blog._id });
      await blog.remove();
    }
    return true;
  }

  async pager(options) {
    options = this.getPagerOptions(options);
    if (options.categoryid == -1 || !options.categoryid) {
      options.categoryid = -1;
    }
    options.keyword = options.keyword ? options.keyword.trim() : '';
    const filter = {};
    if (options.categoryid !== -1) {
      filter.categoryId = options.categoryid;
    }
    if (options.keyword) {
      filter['$or'] = [
        { title: { $regex: options.keyword, $options: 'i' } },
        { description: { $regex: options.keyword, $options: 'i' } },
      ];
    }
    const startDate = new Date('2023-01-01T00:00:00Z');
    const endDate = new Date('2025-01-01T00:00:00Z');
    // 生成一个包含所有月份的数组  
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // 定义一个函数来填充缺失的月份  
    function fillMissingMonths(result, allMonths) {
      const filledResult = allMonths.map(month => {
        const foundMonth = result.find(r => r._id === month);
        return foundMonth || { _id: month, count: 0 };
      });
      return filledResult;
    }
    let month = []
    await this.ctx.model.Blog.aggregate()
      .match({
        createDate: {
          $gte: startDate.getTime(), // 开始日期的时间戳  
          $lt: endDate.getTime() // 结束日期的时间戳（不包括）  
        }
      })
      .addFields({
        month: { $month: { $toDate: '$createDate' } } // 将时间戳转换为月份  
      })
      .group({
        _id: "$month",
        count: { $sum: 1 }
      })
      .sort({ _id: 1 })
      .exec((err, rawResult) => {
        if (err) {
          console.error(err);
          return;
        }

        // 填充缺失的月份  
        const filledResult = fillMissingMonths(rawResult, months);
        month = filledResult

      });
    const total = await this.ctx.model.Blog.countDocuments(filter);
    const rows = await this.ctx.model.Blog.find(filter)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort('-createDate')
      .populate('categoryId')
      .select('-htmlContent');
    return {
      total,
      rows,
      month
    };
  }
}

module.exports = BlogService;
