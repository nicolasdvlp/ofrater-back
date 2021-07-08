const Appointment = require('../models/Appointment');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Role = require('../models/Role');
const Service = require('../models/Service');
const Shop = require('../models/Shop');
const User = require('../models/User');

User.belongsToMany(Shop, {
  through: 'user_owns_shop',
  foreignKey: 'shop_id',
  otherKey: 'service_id',
  as: 'owns'
})

User.hasMany(Appointment, {
  foreignKey: 'user_id',
  as: 'appointments'
})

User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'roles'
})

Shop.hasMany(Appointment, {
  foreignKey: 'shop_id',
  as: 'appointments'
})

Shop.hasMany(Review, {
  foreignKey: 'shop_id',
  as: 'reviews'
})

Shop.belongsToMany(User, {
  through: 'user_owns_shop',
  foreignKey: 'shop_id',
  otherKey: 'service_id',
  as: 'owners'
})

Shop.belongsToMany(Category, {
  through: 'shop_has_category',
  foreignKey: 'shop_id',
  otherKey: 'category_id',
  as: 'categories'
})

Shop.belongsToMany(Service, {
  through: 'shop_has_service',
  foreignKey: 'shop_id',
  otherKey: 'category_id',
  as: 'services'
})

Appointment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'bookedBy'
})

Appointment.belongsTo(Shop, {
  foreignKey: 'shop_id',
  as: 'shop'
})

Appointment.belongsTo(Service, {
  foreignKey: 'shop_id',
  as: 'service_id'
})

Review.belongsTo(Shop, {
  foreignKey: 'shop_id',
  as: 'shops'
})

Category.belongsToMany(Shop, {
  through: 'shop_has_category',
  foreignKey: 'shop_id',
  otherKey: 'category_id',
  as: 'shops'
})

Service.hasMany(Appointment, {
  foreignKey: 'shop_id',
  as: 'service_id'
})

Service.belongsToMany(Shop, {
  through: 'shop_has_service',
  foreignKey: 'shop_id',
  otherKey: 'category_id',
  as: 'shops'
})

Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users'
})

module.exports.Appointment = Appointment;
module.exports.Category = Category;
module.exports.Review = Review;
module.exports.Role = Role;
module.exports.Service = Service;
module.exports.Shop = Shop;
module.exports.User = User;