// src/services/userService.js
const json = require('body-parser/lib/types/json');
const db = require('../config/db'); // Import database connection

// Function to get the latest user ID
// async function getLatestUserId() {
//     try {
//         const result = await db.query('SELECT MAX(user_id) AS user_id FROM test_user');
//         // Log the result to ensure it has the correct structure
//         console.log('Query result:', result);
//        // Safely access latestUserId, check if result array has at least one item, and return latestUserId
//        const latestUserId = result.length > 0 ? result[0].user_id : 0; 
//        console.log('Latest User ID:',result[0].user_id);
//         return latestUserId;
//     } catch (error) {
//         throw new Error('Error fetching latest user ID');
//     }
// }


// async function getLatestUserId() { 
//     try {
//         const result = await db.query('SELECT MAX(user_id) AS user_id FROM test_user');
        


//         // Log the entire result object to inspect its structure
//         // console.log('Full query result:', result);
        
//         // Check if the result has a `rows` property or use result directly
//         const rows = result.rows || result;
        
//         let latestUserId = 0;

//         // Loop through the rows to find user_id
//         for (let i = 0; i < rows.length; i++) {
//             console.log(rows[i].user_id);
//             // if (rows[i].user_id !== undefined) {
//             //     latestUserId = rows[i].user_id;
//             //     console.log('Found user_id:', latestUserId);
//             //     break; // Exit loop after finding the user_id
//             // }
//         }
        
//         // Log the final result
//         console.log('Latest User ID:', latestUserId);
        
//         return latestUserId;
//     } catch (error) {
//         console.error('Error fetching latest user ID:', error.message);
//         throw new Error('Error fetching latest user ID');
//     }
// }

// function getLatestUserId() {
//     return db.query('SELECT MAX(user_id) AS user_id FROM test_user')
//         .then(result => {
//             // Log the entire result object to inspect its structure
//             console.log('Full query result:', result);

//             // Check if the result has a `rows` property or use result directly
//             const rows = result.rows || result;

//             let latestUserId = 0;

//             // Loop through the rows to find user_id
//             for (let i = 0; i < rows.length; i++) {
//                 if (rows[i].user_id !== undefined) {
//                     latestUserId = rows[i].user_id;
//                     console.log('Found user_id:', latestUserId);
//                     break; // Exit loop after finding the user_id
//                 }
//             }

//             // Log the final result
//             console.log('Latest User ID:', latestUserId);
//             return latestUserId;
//         })
//         .catch(error => {
//             console.error('Error fetching latest user ID:', error.message);
//             throw new Error('Error fetching latest user ID');
//         });
// }

function getLatestUserId() {
    return db.query('SELECT MAX(user_id) AS user_id FROM master_table')
        .then(result => {
            // Access the first element of the first array to get the user_id
            const firstRow = result[0] && result[0][0];
            
            let latestUserId = 0;

            // Check if firstRow is defined and has user_id
            if (firstRow && firstRow.user_id !== null) {
                latestUserId = firstRow.user_id;
            } 
            return latestUserId;
        })
        .catch(error => {
            console.error('Error fetching latest user ID:', error.message);
            throw new Error('Error fetching latest user ID');
        });
}

async function getCurrentUserId(req) {
  
    // Fetch the user ID from the session (or use your own logic)
    const userId = req.session.userId; 
    
    // Return the userId (don't send the response here)
    return userId;
}


async function getNewUserId(latestUserId) {
    try {
        const newUserId =  parseInt(latestUserId) + 1;
        return newUserId;
    } catch (error) {
        throw new Error('Error returning new user ID: ' + error.message);
    }
}

async function postUserAge(userId,userAge) {
    // console.log(userId,userAge);
     if (!userId || !userAge) {
        return res.json({ success: false, message: 'Invalid userId or userAge ' });
    }
    try {
        // console.log(userId,userAge);
        const query = `
            UPDATE test_user 
            SET user_age = ?, created_at = NOW() 
            WHERE user_id = ?;
        `;
        await db.query(query, [userAge, userId]);
        return { success: true };

    } catch (error) {
        console.error('Error updating user age:', error);
        throw new Error('Failed to update age');
    }
}

// Function to insert a new user with the incremented user ID
async function insertNewUser(newUserId) {
    try {
        await db.query('INSERT INTO test_user (user_id) VALUES (?)', [newUserId]);
        return newUserId;
    } catch (error) {
        throw new Error('Error inserting new user');
    }
}

module.exports = {
    getLatestUserId,
    insertNewUser,
    getNewUserId,
    getCurrentUserId,
    postUserAge
};
