document.addEventListener('DOMContentLoaded', () => {
    // Function to show car details in a popup
    function showCarDetails(car) {
        const popup = document.getElementById('car-details-popup');
        const popupContent = document.getElementById('popup-content');

        popupContent.innerHTML = `
            <h3>${car.name}</h3>
            <img src="${car.imageUrl}" alt="${car.name}" style="width:100%">
            <p>Price: Rs.${car.price}/day</p>
        `;

        popup.style.display = 'block';
    }

    // Function to hide the car details popup
    function hideCarDetailsPopup() {
        const popup = document.getElementById('car-details-popup');
        popup.style.display = 'none';
    }

    // Attach event listeners to the "View Details" buttons
    const viewDetailsButtons = document.querySelectorAll('.car-item button');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const carItem = event.target.closest('.car-item');
            const car = {
                name: carItem.querySelector('h3').textContent,
                imageUrl: carItem.querySelector('img').src,
                price: carItem.getAttribute('data-price'),
                type: carItem.getAttribute('data-type'),
                brand: carItem.getAttribute('data-brand')
            };
            showCarDetails(car);
        });
    });

    // Attach event listener to the close button of the popup
    const closePopupBtn = document.getElementById('close-popup-btn');
    closePopupBtn.addEventListener('click', hideCarDetailsPopup);

     // Attach event listener to the document for the "Escape" key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                hideCarDetailsPopup();
            }
        });

});
