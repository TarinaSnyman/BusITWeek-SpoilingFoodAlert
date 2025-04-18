

document.addEventListener('DOMContentLoaded', async () => {
    // get the userID from localstorage
    const userID = localStorage.getItem('userid');

// if someone logs out but goes back to the page makes them log in again
    if (!userID) {
        console.error('No userID found in localStorage. Please log in.');
        alert("Please log in.");
        window.location.href='LogIn.html';//redirects to the login page
        return;
    }

    try {
        // get the user's food items from the backend
        const response = await fetch(`http://localhost:3000/userfood/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.success) {
            const table = document.querySelector('.foodTableContainer table'); // gt the table element
            let tbody = table.querySelector('tbody');// get the tbody element 
            if (!tbody) {
                tbody = document.createElement('tbody');
                table.appendChild(tbody);
            }
            tbody.innerHTML = '';// clear any existing rows in tbody

            // append users food items to the table
            data.foodItems.forEach(item => {
                const expiryDate = new Date(item.ExpiryDate);//gets the expiry date
                expiryDate.setHours(0, 0, 0, 0);// sets hours, minutes, seconds and milliseconds to 0
                const warningStatus = getWarningStatus(expiryDate);// calls the worning status function
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.FoodName}</td>
                    <td>${item.Quantity}</td>
                    <td>${new Date(item.ExpiryDate).toLocaleDateString()}</td>
                    <td>${warningStatus.message}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch food items:', data.message);
        }
    } catch (error) {
        console.error('Error fetching food items:', error);
    }


    document.querySelector('#btnLogout').addEventListener('click', function(event) {
        localStorage.clear();
        window.location.href='LogIn.html';//redirects to the login page

    });
});

// determines warning status based on  the expiry date
function getWarningStatus(expiryDate) {
    const currentDate = new Date();//gets current date
    currentDate.setHours(0, 0, 0, 0);

    const timeDifference = expiryDate - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); //convert to days

    if (daysDifference < 5 && daysDifference >= 0) {
        return {
            message: '⚠️ Expiring Soon!'
        };
    }
    return {
        message: ''
    };
}