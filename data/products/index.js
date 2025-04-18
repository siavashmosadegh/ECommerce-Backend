'use strict';

import {loadSqlQueries} from '../utils.js';
//import {sqlconfig} from '../../config.js';
import pkg from 'mssql';
const {
    connect,
    sql,
    NVarChar,
    Int,
    Bit,
    DateTime,
    Decimal,
    NText,
    Request,
    UniqueIdentifier
} = pkg;

const getProductsData = async (search) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });
        const sqlQueries = await loadSqlQueries('products');
        let list = null;
        if (search !== null && search !== undefined) {
            list = await pool.request()
                            .input('ProductName', NVarChar(100), search)
                            .query(sqlQueries.searchProduct);
        } else if (search === undefined) {
            list = await pool.request().query(sqlQueries.productslist);
        }
        return list.recordset;
    } catch (error) {
        return error.message
    }
}

const createNewProduct = async (productData) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }            
        });

        const {
            ProductName,
            Description,
            SKU,
            Price,
            CarID,
            productTypeID,
            ProductTypeBrandID,
            CategoryID,
            DiscountID,
            ProductInventoryID,
            productIsOriginal
        } = productData;

        console.log(productIsOriginal);

        let query = `INSERT INTO Product (ProductName, Description, SKU, Price, CarID, productTypeID, ProductTypeBrandID `;
        let values = ` VALUES (@ProductName, @Description, @SKU, @Price, @CarID, @productTypeID, @ProductTypeBrandID `;

        if (CategoryID) {
            query += `, CategoryID`;
            values += `, @CategoryID`
        }

        if (DiscountID) {
            query += `, DiscountID`;
            values += `, @DiscountID`
        }

        if (ProductInventoryID) {
            query += `, ProductInventoryID`;
            values += `, @ProductInventoryID`
        }

        if (productIsOriginal !== undefined) {
            console.log(`productIsOriginal: ${productIsOriginal}`);
            query += `, productIsOriginal`;
            values += `, @productIsOriginal`
        }

        query += `)`;
        values += `)`;

        const finalQuery = query + values;

        const request = new Request;

        request.input('ProductName', NVarChar(255), ProductName);
        request.input('Description', NText, Description);
        request.input('SKU', NVarChar(255), SKU);
        request.input('Price', Decimal(18,0), Price);
        request.input('CarID', Int, CarID);
        request.input('productTypeID', Int, productTypeID);
        request.input('ProductTypeBrandID', Int, ProductTypeBrandID);

        if (CategoryID) {
            request.input('CategoryID', Int, CategoryID);
        }

        if (DiscountID) {
            request.input('DiscountID', Int, DiscountID);
        }

        if (ProductInventoryID) {
            request.input('ProductInventoryID', Int, ProductInventoryID);
        }

        if (productIsOriginal !== undefined) {
            console.log(`productIsOriginal: ${productIsOriginal}`);
            request.input('productIsOriginal', Bit, productIsOriginal);
        }

        console.log(finalQuery);

        await request.query(finalQuery);

    } catch (error) {
        return error.message
    }
}

const getProductById = async (productId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });
        const sqlQueries = await loadSqlQueries('products');
        const oneProduct = await pool.request()
                                .input('productId', UniqueIdentifier(), productId)
                                .query(sqlQueries.productById);
        return oneProduct.recordset;
    } catch (error) {
        return error.message;
    }
}

const updateProductById = async (productId, productData) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });
        const sqlQueries = await loadSqlQueries('products');
        const update = await pool.request()
                                    .input('ProductId', Int(), productId)
                                    .input('ProductName', NVarChar(100), productData.ProductName)
                                    .input('Description', NVarChar(100), productData.Description)
                                    .input('SKU', NVarChar(100), productData.SKU)
                                    .input('CategoryID', Int(), productData.CategoryID)
                                    .input('InventoryID', Int(), productData.InventoryID)
                                    .input('Price', Int(), productData.Price)
                                    .input('DiscountID', Int(), productData.DiscountID)
                                    .query(sqlQueries.updateProduct);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const deleteProductById = async (productId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });
        const sqlQueries = await loadSqlQueries('products');
        const deleted = await pool.request()
                                .input('productId', Int(), productId)
                                .query(sqlQueries.deleteProduct);
        return deleted.recordset;

    } catch (error) {
        return error.message;
    }
}

const getReviewsOfOneProductData = async (productId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });
        
        const sqlQueries = await loadSqlQueries('products');

        const existingProduct = await pool.request()
            .input('productId', Int, productId)
            .query(sqlQueries.checkProductExistance);

        if (existingProduct.recordset.length === 0 ) {
            console.log("This Product Does Not Exist");
            return "This Product Does Not Exist";
        }

        const result = await pool.request()
                                .input('productId', Int(), productId)
                                .query(sqlQueries.getReviewsOfOneProduct);

        return result.recordset;

    } catch (error) {
        return error.message;
    }
}

const addNewCategoryData = async (data) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });
        
        const sqlQueries = await loadSqlQueries('products');

        const insertCategory = await pool.request()
            .input('CategoryName', NVarChar(100), data.CategoryName)
            .input('Description', NVarChar(255), data.Description)
            .input('FarsiCategoryName', NVarChar(100), data.FarsiCategoryName)
            .query(sqlQueries.CreateCategory);

        return insertCategory.recordset;
    } catch (error) {
        return error.message;
    }
}

const getCategoryData = async (CategoryID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });
        
        const sqlQueries = await loadSqlQueries('products');

        const category = await pool.request()
            .input('CategoryID', Int, CategoryID)
            .query(sqlQueries.getCategoryByCategoryID);

        if (category.recordset.length === 0 ) {
            return "There is no category with the provided id";
        }

        return category.recordset;
    } catch (error) {
        return error.message;
    }
}

const getAllCategoriesData = async () => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });
        
        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .query(sqlQueries.getAllCategories);

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const getProductByCategoryIDData = async (CategoryID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });
        
        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('CategoryID', Int, CategoryID)
            .query(sqlQueries.getProductsByCategoryID);

        if (result.recordset.length === 0 ) {
            return "There is no product with the provided categoryID";
        }

        return result.recordset;
        
    } catch (error) {
        return error.message;
    }
}

const getAllCarBrandsData = async (CategoryID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .query(sqlQueries.getAllCarBrands);

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const addNewCarBrandData = async (data) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('CarBrandName', NVarChar(50), data.CarBrandName)
            .input('CarBrandNameFarsi', NVarChar(50), data.CarBrandNameFarsi)
            .query(sqlQueries.CreateCarBrand);

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const getCarBrandByCarBrandIDData = async (brandID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('brandID', Int, brandID)
            .query(sqlQueries.getCarBrandByCarBrandID);

        if (result.recordset.length === 0 ) {
            return "There is no car brand with the provided id";
        }

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const addNewProductTypeData = async (data) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('categoryID', Int, data.categoryID)
            .input('productTypeName', NVarChar(50), data.productTypeName)
            .input('productTypeNameFarsi', NVarChar(50), data.productTypeNameFarsi)
            .query(sqlQueries.CreateNewProductType);

        return result.recordset;

    } catch (error) {
        return error.message;
    }
}

const getProductTypeByCategoryIDData = async (categoryID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('categoryID', Int, categoryID)
            .query(sqlQueries.getProductTypeByCategoryID);

        
        if (result.recordset.length === 0 ) {
            return "There is no product type with the provided category id";
        }

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const createNewCarData = async ( data ) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        // const sqlQueries = await loadSqlQueries('products');

        const {
            CarBrandID,
            CarModel,
            CarModelFarsi,
            TrimLevel,
            TrimLevelFarsi,
            SubTrimLevel,
            SubTrimLevelFarsi,
            Year,
            CarName,
            CarNameFarsi,
            Engine
        } = data;

        console.log(data);

        console.log(SubTrimLevel);

        let query = `INSERT INTO Car (CarBrandID, CarModel, CarModelFarsi, CarName, CarNameFarsi`;
        let values = ` VALUES (@CarBrandID, @CarModel, @CarModelFarsi, @CarName, @CarNameFarsi`;

        if (TrimLevel) {
            query += `, TrimLevel`;
            values += `, @TrimLevel`
        }

        if (TrimLevelFarsi) {
            query += `, TrimLevelFarsi`;
            values += `, @TrimLevelFarsi`;
        }

        if (SubTrimLevel) {
            query += `, SubTrimLevel`;
            values += `, @SubTrimLevel`;
        }

        if (SubTrimLevelFarsi) {
            query += `, SubTrimLevelFarsi`;
            values += `, @SubTrimLevelFarsi`;
        }

        if (Year) {
            query += `, Year`;
            values += `, @Year`;
        }

        if (Engine) {
            query += `, Engine`;
            values += `, @Engine`;
        }

        query += `)`;
        values += `)`;

        const finalQuery = query + values;

        const request = new Request;

        request.input('CarBrandID', Int, CarBrandID);
        request.input('CarModel', NVarChar(50), CarModel);
        request.input('CarModelFarsi', NVarChar(50), CarModelFarsi);
        request.input('CarName', NVarChar(50), CarName);
        request.input('CarNameFarsi', NVarChar(50), CarNameFarsi);

        if (TrimLevel) {
            request.input('TrimLevel', NVarChar(50), TrimLevel);
        }

        if (TrimLevelFarsi) {
            request.input('TrimLevelFarsi', NVarChar(50), TrimLevelFarsi);
        }

        if (SubTrimLevel) {
            request.input('SubTrimLevel', NVarChar(50), SubTrimLevel);
        }

        if (SubTrimLevelFarsi) {
            request.input('SubTrimLevelFarsi', NVarChar(50), SubTrimLevelFarsi);
        }

        if (Year) {
            request.input('Year', Int, Year);
        }

        if (Engine) {
            request.input('Engine', NVarChar(50), Engine)
        }

        console.log(query);

        await request.query(finalQuery);

    } catch (error) {
        return error.message;
    }
}

const getCarByCarBrandIDData = async ( carBrandID ) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('carBrandID', Int, carBrandID)
            .query(sqlQueries.getCarByCarBrandID);

        if (result.recordset.length === 0 ) {
            return "There is no car with the provided car brand id";
        }

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const createNewProductTypeBrandData = async ( data ) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('ProductTypeBrandName', NVarChar(50), data.ProductTypeBrandName)
            .input('ProductTypeBrandNameFarsi', NVarChar(50), data.ProductTypeBrandNameFarsi)
            .query(sqlQueries.CreateNewProductTypeBrand);

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const getAllProductTypeBrandsData = async (data) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .query(sqlQueries.getAllProductTypeBrands);

        if (result.recordset.length === 0 ) {
            return "There is no product type brand registered";
        }

        return result.recordset

    } catch (error) {
        return error.message;
    }
}

const getProductFeaturesByProductIDData = async (productID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('productID', UniqueIdentifier, productID)
            .query(sqlQueries.getProductFeaturesByProductID);

        console.log(result);

        if (result.recordset.length === 0 ) {
            return "There are not any product features with the provided product id";
        }

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const getAllCarsData = async () => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .query(sqlQueries.getAllCars);

        if (result.recordset.length === 0 ) {
            return "There aren't any cars available";
        }

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const createNewProductFeatureData = async (data) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const {
            ProductID,
            Title,
            Explanation
        } = data;

        const insertCategory = await pool.request()
            .input('ProductID', UniqueIdentifier, ProductID)
            .input('Title', NVarChar(255), Title)
            .input('Explanation', NVarChar(255), Explanation)
            .query(sqlQueries.CreateNewProductFeature);

        return insertCategory.recordset;

    } catch (error) {
        return error.message;
    }

}

const getProductsBasedOnCarViaProductTypeIDData = async (productTypeID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('productTypeID', Int, productTypeID)
            .query(sqlQueries.getProductsBasedOnCarViaProductTypeID);

        const secondResult = await pool.request()
            .input('productTypeID', Int, productTypeID)
            .query(sqlQueries.getProductTypeBasedOnProductTypeID);

        result.recordset = {
            productTypeDetails: secondResult.recordset,
            data: result.recordset
        };

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const getProductTypeByProductTypeIDData = async (productTypeID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('productTypeID', Int, productTypeID)
            .query(sqlQueries.getProductTypeBasedOnProductTypeID);

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const getCarByCarIDData = async (carID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('carID', Int, carID)
            .query(sqlQueries.getCarByCarID);

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const getProductsByCarIdAndProductTypeIdData = async (productTypeId, carId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('carId', Int, carId)
            .input('productTypeId', Int, productTypeId)
            .query(sqlQueries.getProductsByProductTypeIdAndCarId);

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const getAllTrimLevelsOfCarByCarIdData = async (carId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        const result = await pool.request()
            .input('carId', Int, carId)
            .query(sqlQueries.getAllTrimLevelsOfCarByCarId);

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

const getProductTypeBrandNameByProductIdData = async (productId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('products');

        console.log(productId);

        const result = await pool.request()
            .input('productId', UniqueIdentifier, productId)
            .query(sqlQueries.getProductTypeBrandNameByProductId);

        console.log(result);

        return result.recordset;
    } catch (error) {
        return error.message;
    }
}

export {
    getProductsData,
    createNewProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getReviewsOfOneProductData,
    addNewCategoryData,
    getCategoryData,
    getAllCategoriesData,
    getProductByCategoryIDData,
    getAllCarBrandsData,
    addNewCarBrandData,
    getCarBrandByCarBrandIDData,
    addNewProductTypeData,
    getProductTypeByCategoryIDData,
    createNewCarData,
    getCarByCarBrandIDData,
    createNewProductTypeBrandData,
    getAllProductTypeBrandsData,
    getProductFeaturesByProductIDData,
    getAllCarsData,
    createNewProductFeatureData,
    getProductsBasedOnCarViaProductTypeIDData,
    getProductTypeByProductTypeIDData,
    getCarByCarIDData,
    getProductsByCarIdAndProductTypeIdData,
    getAllTrimLevelsOfCarByCarIdData,
    getProductTypeBrandNameByProductIdData
}