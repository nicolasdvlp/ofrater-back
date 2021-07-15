if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

const Category = require('../app/models/Category');
const User = require('../app/models/User');
const Shop = require('../app/models/Shop');
const Service = require('../app/models/Service');
const Role = require('../app/models/Role');
const Appointment = require('../app/models/Appointment');
const Review = require('../app/models/Review');


(async () => {

  // Category
  // const freshCaterogies = await Category.findAll();
  // console.log(freshCaterogies);

  // Shop
  // const freshShop = await Shop.findAll();
  // console.log(freshShop);

  // Service
  // const freshService = await Service.findAll();
  // console.log(freshService);

  // Role
  // const freshRole = await Role.findAll();
  // console.log(freshRole);

  // Review
  // const freshReview = await Review.findAll();
  // console.log(freshReview);

  // Appointment
  // const freshAppointment = await Appointment.findAll();
  // console.log(freshAppointment);

  // User
  // const freshUser = await User.findAll();
  // console.log(freshUser);

  // User Pro List
  // const freshUser = await User.findAllPro();
  // console.log(freshUser);

  // const shoplist = await Shop.findShopByCity('Arnac-la-Poste');
  // console.log(shoplist);

  // const user = await User.findById(3);
  // console.log(user);


  // const listCategories = await Category.findAll();
  // console.log(listCategories);


  const toiletteur = new Category({ name: 'Toilottage' });
  toiletteur.insert();
  console.log(toiletteur);


})();