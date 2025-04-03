import Product from "../../dto/product/product.model";
import { qualityStatus } from "../../interfac/product/product.interfac";
import { Request, Response } from "express";
import { ParsedQs } from 'qs';
import { StatusCodes } from "http-status-codes";
const createProduct = async(req: Request, res: Response) : Promise<Response> => {
    const {
        name,
        price,
        description,
        imageURLs,
        quantity,
        tags,
        country,
        brand,
        category,
        discount,
        rating,
        duration,
    } = req.body;
    try {
        const newProduct = new Product({
            name,
            price,
            description,
            imageURLs,
            quantity,
            tags,
            country,
            brand,
            category,
            discount,
            rating,
            duration,
            quality: qualityStatus.HIGH,
            date:Date.now(),
        });
        await newProduct.save();
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Product has been created successfully",
            newProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong ", error: error.message});
    }
};
const fetchProducts = async(req: Request, res: Response) : Promise<Response> => {
    try {
      const products = await Product.find();
      return res.status(StatusCodes.OK).json({message: "Products have been fetched successfully.", products});
   } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong "});
  }
};
const fetchProduct = async(req: Request, res: Response) : Promise<Response> => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Product does not exist"});
      }
      return res.status(StatusCodes.OK).json({message: "Product has been fetched successfully", product})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong"});
    }
};
const updateProduct = async(req: Request, res: Response) : Promise<Response> => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product does not exist"});
        }
        return res.status(StatusCodes.OK).json({message: "Product has been updated successfully", product});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong "});
    }
};
const removeProduct = async(req: Request, res: Response) : Promise<Response> => {
    const { id } = req.params;
    try {
       const product = await Product.findByIdAndDelete(id);
       if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({message: "Product does not exist."});
       }    
       return res.status(StatusCodes.OK).json({message: "Product has been deleted successfully", product});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some thing went wrong "});
    }
};
const searchProduct = async(req: Request<{}, {}, {}, ParsedQs>, res: Response) : Promise<Response> => {
    const {
        category,
        name,
        minPrice,
        maxPrice,
        description,
        imageURLs,
        quantity,
        tags,
        country,
        brand,
        discount,
        minRating,
        maxRating,
        minDuration,
        maxDuration,
        quality,
        sortBy,
        sortOrder = 'asc',
        page = 1,
        limit = 12,
    } = req.query;
    const filter: any = {};
    try {
        if (category) {
            filter.category = category;
        } 
        if (name) {
            filter.name = {$regex: name, $options: 'i'}
        }
        if (quantity) {
            filter.quantity = Number(quantity)
        }
        if (tags && typeof tags === 'string') {
            filter.tags = { $in: tags.split(',').map(tag => tag.trim()) }; // Split by commas for multiple tags
        } else if(Array.isArray(tags)) {
            filter.tags = { $in: tags.map(tag => (typeof tag === 'string' ? tag.trim() : tag)) }; // Handle array
        }
        if (imageURLs && typeof imageURLs === 'string') {
            filter.imageURLs = { $in: imageURLs.split(',').map(imageURL => imageURL.trim()) }; // Split by commas for multiple tags
        } else if (Array.isArray(imageURLs)) {
            filter.imageURLs = { $in: imageURLs.map(imageURL => (typeof imageURL === 'string' ? imageURL.trim() : imageURL))}; // Handle array
        }
        if (country) {
            filter.country = { $regex: country, $options: 'i'}
        }
        if (brand) {
            filter.brand = { $regex: brand, $options: 'i'}
        }
        if (discount) {
            filter.discount = Number(discount);
        }
        if (quantity) {
            filter.quantity = Number(quantity);
        }
        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (minRating || maxRating) {
            filter.rating = {};
            if (minRating) filter.price.$gte = Number(minRating)
            if (maxRating) filter.price.$lte = Number(minRating)
        }
        if (minDuration || maxDuration) {
            filter.duration = {};
            if (minDuration) filter.duration.$gte = Number(minDuration)
            if (maxDuration) filter.duration.$lte = Number(minDuration)  
        }
        if (description) {
            filter.description = {$regex: description, $options: 'i'}
        }
        if (quality) {
            filter.quality = { $regex: quality, $options: 'i'}
        }
        const pageNumber = typeof page === 'string' ? parseInt(page) : 1;
        const limitNumber = typeof limit === 'string' ? parseInt(limit): 12;
        const sortOptions: any = {};
        if (sortBy && typeof sortBy === 'string') {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }
        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
        .sort(sortOptions)
        .skip((pageNumber - 1) * limitNumber)
        .limit(Number(limitNumber))
        return res.status(StatusCodes.OK).json({
            success: true,
            totalProducts,
            products,
            availableProducts: Math.ceil(totalProducts / limitNumber),
            currentPage: pageNumber
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"});
    }
};

export {
    createProduct,
    fetchProducts,
    fetchProduct,
    updateProduct,
    removeProduct,
    searchProduct
}
