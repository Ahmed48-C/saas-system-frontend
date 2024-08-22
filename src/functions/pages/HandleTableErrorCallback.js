import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

const HandleTableErrorCallback = (error, entityName = 'Item', ids, setIds) => {

    if (error.response && error.response.data) {
        let errorMessage = error.response.data;

        // If errorMessage is an object, convert it to a string
        if (typeof errorMessage === 'object') {
            errorMessage = JSON.stringify(errorMessage);
        }

        // Check if the error message includes 'some instances'
        if (errorMessage.includes('some instances')) {
            // Extract the protected model name and related page from the error message
            let match = errorMessage.match(/'(\w+)\.(\w+)'/);
            let relatedModel = match ? match[1].toLowerCase() : ''; // Example: 'Inventory.product' -> 'inventory'

            // Correct regex to extract numeric IDs inside the curly braces
            let idsMatch = errorMessage.match(/\{\[([0-9,\s]+)\]\}/);
            let relatedIds = idsMatch ? idsMatch[1].split(',').map(id => parseInt(id.trim(), 10)) : [];

            // Handle special case for "inventory"
            if (relatedModel === 'inventory') {
                relatedModel = 'inventories';
            } else {
                // Simple pluralization by adding 's'
                relatedModel += 's';
            }

            // Update the context with the extracted IDs
            const setIDs = () => {
                setIds(prevIds => ({
                    ...prevIds,
                    [relatedModel]: relatedIds,
                }));
            }

            console.log(errorMessage);
            console.log(relatedModel);
            console.log(relatedIds);

            toast.error(
                <>
                    Error: This {entityName} is referenced by other objects and cannot be deleted. Go to
                    <NavLink
                    to={`/${relatedModel}`}
                    style={{ color: 'blue', marginLeft: '10px' }}
                    onClick={setIDs}
                    >
                        {relatedModel.charAt(0).toUpperCase() + relatedModel.slice(1)}
                    </NavLink>
                </>
            );
        } else {
            toast.error('Error: ' + errorMessage);
        }
    } else {
        toast.error('Error: ' + error.message);
    }

    console.log(error);
};

export default HandleTableErrorCallback;
