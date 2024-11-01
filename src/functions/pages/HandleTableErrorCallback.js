import React from 'react';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

const HandleTableErrorCallback = (error, entityName = 'Item', ids, setIds) => {
    if (error.response && error.response.data) {
        let errorMessage = error.response.data;

        // If errorMessage is an object, convert it to a string
        if (typeof errorMessage === 'object') {
            errorMessage = JSON.stringify(errorMessage);
        }

        console.log('Error response received:', errorMessage);

        // Check if the error message includes 'some instances'
        if (errorMessage.includes('some instances')) {
            console.log('Error message contains "some instances". Proceeding with extraction.');

            // Extract the protected model name and related page from the error message
            let match = errorMessage.match(/'(\w+)\.(\w+)'/);
            let relatedModel = match ? match[1].toLowerCase() : ''; // Example: 'Inventory.product' -> 'inventory'

            // Correct regex to extract numeric IDs inside the curly braces
            let idsMatch = errorMessage.match(/\{\[([0-9,\s]+)\]\}/);
            let relatedIds = [];

            if (idsMatch) {
                relatedIds = idsMatch[1].split(',').map(id => parseInt(id.trim(), 10)); // Convert IDs to integers
            }

            console.log('Extracted related model:', relatedModel);
            console.log('Extracted IDs:', relatedIds);

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

            // toast.error(
            //     <>
            //         Error: These {entityName}s are referenced by other objects and cannot be deleted. Go to
            //         <NavLink
            //             to={`/${relatedModel}`}
            //             style={{ color: 'blue', marginLeft: '10px' }}
            //             onClick={setIDs}
            //         >
            //             {relatedModel.charAt(0).toUpperCase() + relatedModel.slice(1)}
            //         </NavLink>
            //     </>
            // );
            toast.error(
                <>
                    Error: This item(s) can’t be deleted because it’s connected to other records.
                </>
            );
        } else {
            console.log('Error message does not contain "some instances". Showing a general error toast.');
            toast.error('Error: ' + errorMessage);
        }
    } else {
        console.log('Error response does not contain data. Showing a general error toast.');
        toast.error('Error: ' + error.message);
    }

    console.log('Complete error object:', error);
};

export default HandleTableErrorCallback;
