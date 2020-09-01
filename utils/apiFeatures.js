class APIFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const queryObjCopy = { ...this.queryObj };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObjCopy[el]);

    // 1b) Advanced filtering

    let queryString = JSON.stringify(queryObjCopy);
    queryString = queryString.replace(
      /\b(gte|lte|gt|lt)\b/g,
      match => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    console.log(this.queryObj);
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryObj.page, 10) || 1;
    const limit = parseInt(this.queryObj.limit, 10) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
