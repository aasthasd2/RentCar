document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const carType = document.getElementById('car-type');
    const carBrand = document.getElementById('car-brand');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const carList = document.getElementById('car-list');
    const searchButton = document.getElementById('search-button');

    // Function to fetch car data from the server
    const fetchCars = () => {
        fetch('/api/cars')
            .then(response => response.json())
            .then(data => {
                displayCars(data.cars);
            })
            .catch(error => console.error('Error fetching car data:', error));
    };

    // Function to display car data
    const displayCars = (cars) => {
        carList.innerHTML = '';

        cars.forEach(car => {
            const carItem = document.createElement('div');
            carItem.classList.add('car-item');
            carItem.setAttribute('data-type', car.type);
            carItem.setAttribute('data-brand', car.brand);
            carItem.setAttribute('data-price', car.price);

            carItem.innerHTML = `
                <img src="${car.image}" alt="${car.name}">
                <h3>${car.name}</h3>
                <p>$${car.price}/day</p>
                <a href="${car.name.toLowerCase().replace(/\s/g, '-')}.html"><button>View Details</button></a>
            `;

            carList.appendChild(carItem);
        });
    };

    // Filter function
    const filterCars = () => {
        const searchText = searchBar.value.toLowerCase();
        const selectedType = carType.value;
        const selectedBrand = carBrand.value;
        const maxPrice = priceRange.value;

        priceValue.textContent = `Max Price: $${maxPrice}`;

        const cars = carList.getElementsByClassName('car-item');

        Array.from(cars).forEach(car => {
            const carName = car.querySelector('h3').textContent.toLowerCase();
            const carType = car.getAttribute('data-type');
            const carBrand = car.getAttribute('data-brand');
            const carPrice = car.getAttribute('data-price');

            const matchesSearch = carName.includes(searchText);
            const matchesType = !selectedType || carType === selectedType;
            const matchesBrand = !selectedBrand || carBrand === selectedBrand;
            const matchesPrice = carPrice <= maxPrice;

            if (matchesSearch && matchesType && matchesBrand && matchesPrice) {
                car.style.display = '';
            } else {
                car.style.display = 'none';
            }
        });
    };

    searchBar.addEventListener('input', filterCars);
    carType.addEventListener('change', filterCars);
    carBrand.addEventListener('change', filterCars);
    priceRange.addEventListener('input', filterCars);
    searchButton.addEventListener('click', filterCars);

    fetchCars();

    // Populate the car select dropdown in the booking form
    const populateBookingCarSelect = () => {
        fetch('/api/cars')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const carSelect = document.getElementById('car-select');
                data.cars.forEach(car => {
                    const option = document.createElement('option');
                    option.value = car.id; // Change to car.id for the booking
                    option.textContent = car.name;
                    carSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching car data:', error));
    };

    // Handle booking form submission
    const bookingForm = document.getElementById('booking-form');
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const carId = document.getElementById('car-select').value;
        const userName = document.getElementById('user-name').value;
        const userEmail = document.getElementById('user-email').value;
        const pickupDate = document.getElementById('pickup-date').value;
        const dropoffDate = document.getElementById('dropoff-date').value;
        const paymentMethod = document.getElementById('payment-method').value;

        fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                car_id: carId,
                user_name: userName,
                user_email: userEmail,
                pickup_date: pickupDate,
                dropoff_date: dropoffDate,
                payment_method: paymentMethod
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('booking-status').textContent = `Booking successful! Booking ID: ${data.booking_id}`;
        })
        .catch(error => {
            document.getElementById('booking-status').textContent = 'Booking failed. Please try again.';
            console.error('Error:', error);
        });
    });

    console.log('searchBar:', searchBar);

    // Populate the car select dropdown when the booking page loads
    if (document.getElementById('car-select')) {
        populateBookingCarSelect();
    }

        // TODO : Make the login page and add function here which stores the data in the backend
});
