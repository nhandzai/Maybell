'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('sizes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // Tạo bảng 'products'
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      shortDescription: {
        type: Sequelize.TEXT
      },
      detail: {
        type: Sequelize.TEXT
      },
      material: {
        type: Sequelize.STRING
      },
      weightKg: {
        type: Sequelize.FLOAT
      },
      realPrice: {
        type: Sequelize.FLOAT
      },
      brandId: { 
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'brands',
          key: 'id'
        },
        onDelete: 'SET NULL' 
      },
      categoryId: { 
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories', 
          key: 'id'
        },
        onDelete: 'SET NULL' 
      },
      stockQuantity: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    
    await queryInterface.createTable('productSizes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      sizeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sizes',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('productImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      image: {
        type: Sequelize.STRING
      },
      isMain: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isAdmin:{
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      comment: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    // Tạo bảng 'orders'
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      cartId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'carts',
          key: 'id'
        },
        onDelete: 'SET NULL',  
        allowNull: true     
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    

   
    // Tạo bảng 'wishlists'
    await queryInterface.createTable('wishlists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    const brands = [
      { id: 1, brand: "APEX", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, brand: "Cof", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, brand: "Puff B&G", createdAt: new Date(), updatedAt: new Date() },
      { id: 4, brand: "Fornighte", createdAt: new Date(), updatedAt: new Date() }
    ];
    const categories = [
      { id: 1, category: "Matrass", image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/xzrabi5dyavxvawj6k7g?_a=BAMCkGXw0",createdAt: new Date(), updatedAt: new Date() },
      { id: 2, category: "Kitchen",image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/okws0n4ou5ef17bx2wfr?_a=BAMCkGXw0", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, category: "Bedroom",image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/lvtowz7waod1u8oedzlo?_a=BAMCkGXw0" , createdAt: new Date(), updatedAt: new Date() },
      { id: 4, category: "Outdoor",image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/ef2vefjenfgxgsd5ppvl?_a=BAMCkGXw0" ,createdAt: new Date(), updatedAt: new Date() },
      { id: 5, category: "Living Room",image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/x5geuqpz1ntxuzbifx9x?_a=BAMCkGXw0" ,createdAt: new Date(), updatedAt: new Date() },
      { id: 6, category: "Sofa",image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/ittdhbnjvkcf3t1qh3fx?_a=BAMCkGXw0", createdAt: new Date(), updatedAt: new Date() }
    ];
    const sizes = [
      { id: 1, size: "XS", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, size: "S", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, size: "M", createdAt: new Date(), updatedAt: new Date() },
      { id: 4, size: "L", createdAt: new Date(), updatedAt: new Date() },
      { id: 5, size: "XL", createdAt: new Date(), updatedAt: new Date() }
    ];
    
    const products = [
      {
        name: "CHAIR", // 1
        price: 55.00,
        shortDescription: "This ergonomic chair is designed for comfort and support...",
        detail: "This ergonomic chair combines both style and function...",
        material: "Fabric, Steel, Wood",
        weightKg: 4.5,
        realPrice: 45.00,
        brandId: "1",
        categoryId: 5, 
        stockQuantity: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "SOFA", // 2
        price: 79.00,
        shortDescription: "A cozy sofa with plush cushions...",
        detail: "A roomy, Italian-style sofa made to be comfortable and convenient...",
        material: "Upholstery, Wood, Foam",
        weightKg: 34.0,
        realPrice: 50.00,
        brandId: "2",
        categoryId: 6, 
        stockQuantity: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "GUYER KITCHEN", // 3
        price: 120.00,
        shortDescription: "This stylish kitchen set offers ample storage space...",
        detail: "The Guyer Kitchen set is designed to combine functionality...",
        material: "Wood, Stainless Steel",
        weightKg: 68.2,
        realPrice: 110.00,
        brandId: "3",
        categoryId: 2,
        stockQuantity: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "GUYER ROOM", // 4
        price: 89.00,
        shortDescription: "A sophisticated living room set designed for ultimate comfort...",
        detail: "The Guyer Room set offers a combination of luxurious comfort...",
        material: "Wood, Fabric, Foam",
        weightKg: 54.4,
        realPrice: 45.00,
        brandId: "4",
        categoryId: 1, 
        stockQuantity: 54,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "BEDROOM", // 5
        price: 65.00,
        shortDescription: "This bedroom set is designed to provide comfort and relaxation...",
        detail: "The Bedroom set combines sophisticated design with maximum comfort...",
        material: "Wood, Fabric, Foam",
        weightKg: 59.0,
        realPrice: 60.00,
        brandId: "1",
        categoryId: 3,  // Sản phẩm này thuộc "Bedroom"
        stockQuantity: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "STREET CHAIR", // 6
        price: 49.00,
        shortDescription: "A durable outdoor chair that combines sturdy construction...",
        detail: "The Street Chair is designed for outdoor comfort and durability...",
        material: "Metal, Fabric",
        weightKg: 6.8,
        realPrice: 45.00,
        brandId: "3",
        categoryId: 4,  // Sản phẩm này thuộc "Outdoor"
        stockQuantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "WHITE SOFA", // 7
        price: 75.00,
        shortDescription: "A roomy and fashionable sofa with high-quality upholstery...",
        detail: "A roomy, Italian-style sofa made to be comfortable and convenient...",
        material: "Upholstery, Wood, Foam",
        weightKg: 38.6,
        realPrice: 53.00,
        brandId: "4",
        categoryId: 6,  // Sản phẩm này thuộc "Sofa"
        stockQuantity: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "COMFY BED", // 8
        price: 85.00,
        shortDescription: "A plush and comfortable bed designed to provide ultimate relaxation...",
        detail: "The Comfy Bed features high-quality materials that ensure maximum comfort...",
        material: "Wood, Fabric, Foam",
        weightKg: 55.0,
        realPrice: 60.00,
        brandId: "1",
        categoryId: 3,  // Sản phẩm này thuộc "Bedroom"
        stockQuantity: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "LUXURY MATRASS", // 9
        price: 120.00,
        shortDescription: "A premium matrass that offers luxurious comfort for a restful night's sleep...",
        detail: "The Luxury Matrass is made with high-density foam...",
        material: "Foam, Fabric",
        weightKg: 20.0,
        realPrice: 111.00,
        brandId: "4",
        categoryId: 1,  // Sản phẩm này thuộc "Matrass"
        stockQuantity: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "OUTDOOR BENCH", // 10
        price: 65.00,
        shortDescription: "A durable outdoor bench perfect for gardens or patios...",
        detail: "The Outdoor Bench is constructed with weather-resistant materials...",
        material: "Metal, Wood",
        weightKg: 12.5,
        realPrice: 32.00,
        brandId: "2",
        categoryId: 4, 
        stockQuantity: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "LIVING GUYER", // 11
        price: 99.00,
        shortDescription: "This versatile living room set offers both comfort and elegance...",
        detail: "The Living Guyer set is crafted to fit perfectly in any modern living room...",
        material: "Wood, Fabric, Foam",
        weightKg: 49.9,
        realPrice: 69.00,
        brandId: "2",
        categoryId: 5,  // Sản phẩm này thuộc "Living Room"
        stockQuantity: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "MODERN KITCHEN SET", // 12
        price: 150.00,
        shortDescription: "A stylish kitchen set designed to optimize storage and functionality...",
        detail: "The Modern Kitchen Set is made of high-quality materials...",
        material: "Wood, Stainless Steel",
        weightKg: 75.0,
        realPrice: 145.00,
        brandId: "3",
        categoryId: 2,  // Sản phẩm này thuộc "Kitchen"
        stockQuantity: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    const productSizes = [
      { productId: 1, sizeId: 1, createdAt: new Date(), updatedAt: new Date() }, // XS
      { productId: 1, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 1, sizeId: 5, createdAt: new Date(), updatedAt: new Date() }, // XL
      { productId: 2, sizeId: 1, createdAt: new Date(), updatedAt: new Date() }, // XS
      { productId: 2, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 2, sizeId: 4, createdAt: new Date(), updatedAt: new Date() }, // L
      { productId: 3, sizeId: 1, createdAt: new Date(), updatedAt: new Date() }, // XS
      { productId: 3, sizeId: 2, createdAt: new Date(), updatedAt: new Date() }, // S
      { productId: 3, sizeId: 5, createdAt: new Date(), updatedAt: new Date() }, // XL
      { productId: 4, sizeId: 2, createdAt: new Date(), updatedAt: new Date() }, // S
      { productId: 4, sizeId: 4, createdAt: new Date(), updatedAt: new Date() }, // L
      { productId: 4, sizeId: 5, createdAt: new Date(), updatedAt: new Date() }, // XL
      { productId: 5, sizeId: 1, createdAt: new Date(), updatedAt: new Date() }, // XS
      { productId: 5, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 5, sizeId: 5, createdAt: new Date(), updatedAt: new Date() }, // XL
      { productId: 6, sizeId: 2, createdAt: new Date(), updatedAt: new Date() }, // S
      { productId: 6, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 6, sizeId: 4, createdAt: new Date(), updatedAt: new Date() }, // L
      { productId: 7, sizeId: 2, createdAt: new Date(), updatedAt: new Date() }, // S
      { productId: 7, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 7, sizeId: 1, createdAt: new Date(), updatedAt: new Date() }, // XS
      { productId: 8, sizeId: 1, createdAt: new Date(), updatedAt: new Date() }, // XS
      { productId: 8, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 8, sizeId: 5, createdAt: new Date(), updatedAt: new Date() }, // XL
      { productId: 9, sizeId: 2, createdAt: new Date(), updatedAt: new Date() }, // S
      { productId: 9, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 9, sizeId: 4, createdAt: new Date(), updatedAt: new Date() }, // L
      { productId: 10, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 10, sizeId: 4, createdAt: new Date(), updatedAt: new Date() }, // L
      { productId: 10, sizeId: 5, createdAt: new Date(), updatedAt: new Date() }, // XL
      { productId: 11, sizeId: 2, createdAt: new Date(), updatedAt: new Date() }, // S
      { productId: 11, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 11, sizeId: 4, createdAt: new Date(), updatedAt: new Date() }, // L
      { productId: 12, sizeId: 1, createdAt: new Date(), updatedAt: new Date() }, // XS
      { productId: 12, sizeId: 3, createdAt: new Date(), updatedAt: new Date() }, // M
      { productId: 12, sizeId: 4, createdAt: new Date(), updatedAt: new Date() }, // L
    ];
    
    
    const productImages = [
      { productId: 1, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/e2mwhai6uet8gxno5zxm?_a=BAMCkGXw0", isMain: true,  createdAt: new Date(), updatedAt: new Date() },

      { productId: 2, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/limmnaufvet2jnxwotxa?_a=BAMCkGXw0", isMain: true,createdAt: new Date(), updatedAt: new Date() },
      
      { productId: 3, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/okws0n4ou5ef17bx2wfr?_a=BAMCkGXw0", isMain: true, createdAt: new Date(), updatedAt: new Date() },
    
      { productId: 4, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/uj4b9e27lyno9qxwyxsd?_a=BAMCkGXw0",isMain: true, createdAt: new Date(), updatedAt: new Date() },
    
      { productId: 5, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/lvtowz7waod1u8oedzlo?_a=BAMCkGXw0",isMain: true, createdAt: new Date(), updatedAt: new Date() },
  
      { productId: 6, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/ef2vefjenfgxgsd5ppvl?_a=BAMCkGXw0",isMain: true, createdAt: new Date(), updatedAt: new Date() },
     
      { productId: 7, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/ittdhbnjvkcf3t1qh3fx?_a=BAMCkGXw0",isMain: true, createdAt: new Date(), updatedAt: new Date() },
     
      { productId: 8, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/mvnp7fxyrbumueyo1guc?_a=BAMCkGXw0",isMain: true, createdAt: new Date(), updatedAt: new Date() },
    
      { productId: 9, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/xzrabi5dyavxvawj6k7g?_a=BAMCkGXw0",isMain: true, createdAt: new Date(), updatedAt: new Date() },
     
      { productId: 10, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/tqowkzicsxelaqfdvbbi?_a=BAMCkGXw0",isMain: true, createdAt: new Date(), updatedAt: new Date() },
     
      { productId: 11, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/x5geuqpz1ntxuzbifx9x?_a=BAMCkGXw0",isMain: true, createdAt: new Date(), updatedAt: new Date() },
     
      { productId: 12, image: "https://res.cloudinary.com/dplrs7uia/image/upload/c_auto,g_auto,h_376,w_564/pcvxtzvuvk2rvcpzfvf9?_a=BAMCkGXw0",isMain: true, createdAt: new Date(), updatedAt: new Date() },
     
    
    ];
    
    await queryInterface.bulkInsert('brands', brands);
    await queryInterface.bulkInsert('sizes', sizes);
    await queryInterface.bulkInsert('categories', categories);
    await queryInterface.bulkInsert('products', products);
    await queryInterface.bulkInsert('productImages', productImages);
    await queryInterface.bulkInsert('productSizes', productSizes);


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sizes');
    await queryInterface.dropTable('brands');
    await queryInterface.dropTable('productSizes');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('productImages');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('reviews');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('carts');
    await queryInterface.dropTable('wishlists');
 
    


  }
};
