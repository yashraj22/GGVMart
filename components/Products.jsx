import React, { useEffect, useState } from 'react';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/product');
                const data = await response.json();
                // Set the products using the 'products' property of the data object
                setProducts(data.products); // Assuming 'data.products' is the array
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="max-w-sm rounded overflow-hidden shadow-lg  hover:shadow-xl transition-shadow duration-300 ease-in-out"
                >
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{product.title}</div>
                        <p className="text-gray-700 text-base">
                            Category: {product.category}
                        </p>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                        {/* Add any other details you'd like to include here, such as price if available */}
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Chat with Seller
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Products;
