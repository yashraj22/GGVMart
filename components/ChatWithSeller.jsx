"use client"
import React from 'react'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { UserAuth } from '@/app/context/AuthContext';

const ChatWithSeller = ({productId}) => {

    const {user} = UserAuth();

    // ChatWithSeller.propTypes = {
    //     productId: PropTypes.number.isRequired,
    // };

    const handleChatWithSeller = async () => {
        console.log('====================================');
        console.log("hello");
        console.log('====================================');
        try {
            // Create a new chat record in the database
            const chat = await prisma.chat.create({
                data: {
                    userId: user.id, // Replace with the actual user ID
                    productId: productId , // Replacep with the actual product ID
                }
            });
            console.log('Chat record created:', chat);
        } catch (error) {
            console.error('Error creating chat record:', error);
        }
    }

    return (
        <div>
            <button className='text-gray-200' onClick={handleChatWithSeller} >
                Chat With Seller
            </button>
        </div>
    )
}

export default ChatWithSeller;