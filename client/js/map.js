(() => {
    //map function
    let map;
    const API_KEY = 'AIzaSyAAiWLw7jE5G1MkBXg_Dw4dsTXDP5de3CU';
    const initMap = () => {
        console.log('calling to display map')
        var vancouver = { lat: 49.2827, lng: -123.1207 };
        //var recife = { lat: -8.05389, lng: -34.88111 }; //this was just to test, delete later
        map = new google.maps.Map(document.getElementById('map'), {
            center: vancouver,
            zoom: 12
        });
    };

    function showLoadingIndicator() {
        document.querySelector('#loadingIndicator').style.display = 'block';
    }

    function hideLoadingIndicator() {
        document.querySelector('#loadingIndicator').style.display = 'none';
    }

    /*     const loadCafeData = async () => {
            fetch('/cafes')
                .then(response => response.json())
                .then(data => {
                    if (data.results) {
                        addCafeMarkers(data.results);
                    }
                })
                .catch(error => console.error('Error fetching cafe data:', error));
        } */

    const loadCafeData = async() => {
        showLoadingIndicator(); // Show the loading indicator before starting the fetch operation
        fetch('/cafes')
            .then(response => response.json())
            .then(data => {
                if (data.results) {
                    addCafeMarkers(data.results); // Assuming addCafeMarkers processes the fetched data
                }
                hideLoadingIndicator(); // Hide the loading indicator after processing data
            })
            .catch(error => {
                console.error('Error fetching cafe data:', error);
                hideLoadingIndicator(); // Hide the loading indicator if an error occurs
            });
    };

    let markers = [];

    let currentInfowindow = null; 

    function addCafeMarkers(cafes) {
        clearMarkers(); 
    
        cafes.forEach(cafe => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(cafe.geometry.location.lat, cafe.geometry.location.lng),
                map: map,
                title: cafe.name
            });
    
            markers.push(marker);
    
            const contentString = `
            <div class="text-primary" id="content">
                <div style="max-width: 100px; "><a href="#" id="id_${cafe.name}" onclick="favoriteClick(); alert('Coffee icon clicked!'); return false;"></div>
                    <div class="d-flex justify-content-start"><i class="bi bi-cup-hot fs-2 text-warning" id="coffee_icon"></i></div>
                </a>
                <span class="fs-5" id="firstHeading">${cafe.name}</span>
                <div id="bodyContent" style="width: 100px; height: 100px; overflow: auto;">
                    <p><b>Address:</b> ${cafe.formatted_address}</p>
                    <p ><b>Rating:</b> ${cafe.rating || 'Not rated'}</p>
                    <p><img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${cafe.photos[0].photo_reference}&key=${API_KEY}" style="max-width: 100%; max-height: 100%; display: block; margin-left: auto; margin-right: 0;"></p>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cafe.formatted_address)}" target="_blank">Get Directions</a>
                </div>
            </div>`;
    
            const infowindow = new google.maps.InfoWindow({
                content: contentString
            });
    
            marker.addListener('click', () => {
                // Close first InfoWindow
                if (currentInfowindow) {
                    currentInfowindow.close();
                }
                // New InfoWindow 
                infowindow.open(map, marker);
                currentInfowindow = infowindow;
            });
        });
    }
    
    //i dont know how to make this work yet but i will find a way
    function favoriteClick() {
        alert("Coffee icon clicked!");
        // You can perform other actions here, such as opening a modal or redirecting the user.
    }

    const clearMarkers = () => {
        markers.forEach(marker => marker.setMap(null));
        markers = []; // Clear the array
    }

    const loadTop20 = () => {
        const tableBody = document.querySelector('#cafesTable').getElementsByTagName('tbody')[0];

        fetch('/top20')
            .then(response => response.json())
            .then(data => {
                data.results.forEach((cafe, index) => {
                const row = tableBody.insertRow();

                    // index
                    const indexCell = row.insertCell(0);
                    const indexSpan = document.createElement('span');
                    indexSpan.className = 'badge bg-primary rounded-pill';
                    indexSpan.textContent = index + 1;
                    indexCell.appendChild(indexSpan);
                    indexCell.style.textAlign = 'center';

                   // Name
                   const nameCell = row.insertCell(1);
                   const strongText = document.createElement('strong');  
                   strongText.textContent = cafe.name;               
                   nameCell.appendChild(strongText);                 
                   nameCell.style.textAlign = 'center';
                   nameCell.style.color = '#ce9045'; 
                   nameCell.style.maxWidth = '180px';
                   

                    // Rating
                    const ratingCell = row.insertCell(2);
                    ratingCell.style.textAlign = 'center';
                    ratingCell.className = 'text-primary d-flex justify-content-center align-items-center'; 
                    
                    // Rating Icon
                    const ratingIcon = document.createElement('i');
                    ratingIcon.className = 'bi bi-star-fill position-absolute'; 
                    ratingIcon.style.fontSize = '40px'; 
                    ratingIcon.style.color = '#eab872'; 

                    // Rating Text
                    const ratingSpan = document.createElement('span');
                    ratingSpan.textContent = cafe.rating;
                    ratingSpan.className = 'position-relative badge text-primary rounded-pill';

                    ratingCell.style.display = 'flex';
                    ratingCell.style.justifyContent = 'center'; 
                    ratingCell.style.alignItems = 'center'; 
                    ratingCell.style.position = 'relative'; 
                    ratingCell.style.height = '50px';

                    ratingCell.appendChild(ratingIcon);
                    ratingCell.appendChild(ratingSpan);

                    // User Total
                    const ratingsCell = row.insertCell(3);
                    const ratingsText = document.createElement('span');
                    ratingsText.className = 'badge bg-primary rounded-pill';
                    ratingsText.textContent = cafe.user_ratings_total;
                    ratingsCell.appendChild(ratingsText);
                    ratingsCell.style.textAlign = 'center';
                    ratingsCell.style.minWidth = '150px';

                    

                    // Address
                    const addressCell = row.insertCell(4);
                    addressCell.textContent = cafe.formatted_address;
                    addressCell.style.textAlign = 'center';
                    addressCell.style.overflow = 'hidden';
                    addressCell.style.whiteSpace = 'nowrap';
                    addressCell.style.textOverflow = 'ellipsis';
                    addressCell.style.maxWidth = '280px';
                    addressCell.style.color = '#dda25b';

                    const pictureCell = row.insertCell(5);
                    if (cafe.photos && cafe.photos.length > 0) {
                        const imgUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${cafe.photos[0].photo_reference}&key=${API_KEY}`;
                        
                        // Image Container
                        const imgContainer = document.createElement('div');
                        imgContainer.style.width = '100px';  
                        imgContainer.style.height = '50px';  
                        imgContainer.style.overflow = 'hidden';  
                        imgContainer.style.display = 'flex';  
                        imgContainer.style.justifyContent = 'center';  
                        imgContainer.style.alignItems = 'center';  
                    
                        // Create Image
                        const img = document.createElement('img');
                        img.src = imgUrl;
                        img.alt = 'Cafe Image';
                        img.style.width = '100%';  
                        img.style.height = 'auto%'; 
                        img.style.minHeight = 'auto%'; 

                        imgContainer.appendChild(img);
                        pictureCell.appendChild(imgContainer);
                    } else {
                        pictureCell.textContent = 'No Image Available';
                    }
                    
                });
            })
            .catch(error => {
                console.error('Error loading cafe data:', error);
            });

    }
    document.querySelector('#loadDataButton').addEventListener('click', () => {
        const cafesContainer = document.querySelector('#cafesContainer');
        cafesContainer.style.display = 'block'; // Show the container

        // Load data only if it has not been loaded yet
        if (!cafesContainer.classList.contains('data-loaded')) {
            loadTop20(); // Call your data loading function
            cafesContainer.classList.add('data-loaded'); // Mark as loaded
        }
    });

    window.addEventListener('DOMContentLoaded', async () => {
        initMap();
        await loadCafeData();
    });

})()
