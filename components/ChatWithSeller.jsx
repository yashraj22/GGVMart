
import React from 'react'
import { PrismaClient } from '@prisma/client';
import PropTypes from 'prop-types';
const prisma = new PrismaClient();
import { UserAuth } from '@/app/context/AuthContext';

const ChatWithSeller = ({productId}) => {

    const {user} = UserAuth();

   

    const handleChatWithSeller = async () => {
       
        console.log('====================================');
        console.log("hello");
        console.log('====================================');
       
 ChatWithSeller.propTypes = {
        productId: PropTypes.number.isRequired,
    };


        try {
            const response = await fetch('/api/chart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id, // Replace with the actual user ID
                    productId: productId , // Replacep with the actual product ID
                }),
            });
         
            if (response.ok) {
          
            } else {
          
            }
        } catch (error) {
            console.error('Error calling API:', error);
        
        }

    }

    return (
        <div>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleChatWithSeller} >
                Chat With Seller
            </button>
        </div>
    )
}

export default ChatWithSeller;