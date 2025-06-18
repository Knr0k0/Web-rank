// js/leaderboard.js
document.addEventListener('DOMContentLoaded', () => {
    let bikeListGlobal = []; // To store the fetched rider list for modal use
    const addRiderModalInstance = new bootstrap.Modal(document.getElementById('addRiderModal'));
    const viewRiderDetailModalInstance = new bootstrap.Modal(document.getElementById('viewRiderDetailModal'));
    const bikeRankingBody = document.getElementById('bike-ranking-body');

    /**
     * Shows a loading spinner in the table body.
     */
    function showLoadingIndicator() {
        bikeRankingBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center p-4">
                    <div class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Fetches rider data from the API and dynamically populates the leaderboard table.
     */
    async function fetchAndDisplayBikes() {
        showLoadingIndicator();
        try {
            const response = await fetch('/api/bikes');
            if (!response.ok) {
                throw new Error(`Network error: ${response.statusText}`);
            }
            bikeListGlobal = await response.json();
            
            bikeRankingBody.innerHTML = ''; // Clear loading spinner
            if (bikeListGlobal.length === 0) {
                bikeRankingBody.innerHTML = `<tr><td colspan="7" class="text-center">No riders found. Add one!</td></tr>`;
                return;
            }

            bikeListGlobal.forEach(bike => {
                const row = document.createElement('tr');
                const riderName = bike.bikerName || 'N/A'; // Fallback for name
                const riderImage = bike.bikerImage || 'img/placeholder/default_rider.png'; // Fallback for image

                row.innerHTML = `
                    <td>${bike.rank}</td>
                    <td><img src="${riderImage}" alt="Photo of ${riderName}" class="rider-image-thumbnail" loading="lazy"></td>
                    <td>${riderName}</td>
                    <td>${bike.bikeBrand || 'N/A'}</td>
                    <td>${bike.keyFeature || 'N/A'}</td>
                    <td>${bike.overallScore || 'N/A'}</td>
                    <td><button class="btn btn-info btn-sm view-rider-details-btn" data-rider-id="${bike.id}" aria-label="View details for ${riderName}">View</button></td>
                `;
                bikeRankingBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching bikes:', error);
            bikeRankingBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading rider data. Please try again later.</td></tr>`;
        }
    }

    /**
     * Event Delegation for "View Details" buttons.
     */
    bikeRankingBody.addEventListener('click', (event) => {
        const button = event.target.closest('.view-rider-details-btn');
        if (button) {
            const riderId = parseInt(button.dataset.riderId, 10);
            const riderData = bikeListGlobal.find(bike => bike.id === riderId);
            if (riderData) {
                // Populate and show the modal
                document.getElementById('viewRiderDetailModalLabel').textContent = `${riderData.bikerName} - Details`;
                document.getElementById('detailRiderImage').src = riderData.bikerImage || 'img/placeholder/default_rider.png';
                document.getElementById('detailBikeImageModal').src = riderData.bikeImage || 'img/placeholder/default_bike.png';
                document.getElementById('detailRiderName').textContent = riderData.bikerName;
                document.getElementById('detailTeamBrand').textContent = riderData.bikeBrand;
                document.getElementById('detailAge').textContent = riderData.age;
                document.getElementById('detailKeyFeature').textContent = riderData.keyFeature;
                document.getElementById('detailOverallScore').textContent = riderData.overallScore;
                document.getElementById('detailRank').textContent = riderData.rank;
                viewRiderDetailModalInstance.show();
            }
        }
    });

    /**
     * Handles the "Add Rider" form submission.
     */
    const riderForm = document.getElementById("riderFormModal");
    if (riderForm) {
        riderForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const riderImageFile = document.getElementById("riderImageFileModal").files[0];
            const bikeImageFile = document.getElementById("bikeImageFileModal").files[0];
            if (!riderImageFile || !bikeImageFile) {
                alert("Please select both rider and bike images.");
                return;
            }
            const formData = {
                rank: document.getElementById("rankModal").value,
                bikerName: document.getElementById("riderNameModal").value,
                bikeBrand: document.getElementById("bikeBrandModal").value,
                age: document.getElementById("ageModal").value,
                keyFeature: document.getElementById("keyFeatureModal").value,
                overallScore: document.getElementById("overallScoreModal").value,
            };

            const readerRiderImage = new FileReader();
            readerRiderImage.onloadend = () => {
                formData.bikerImage = readerRiderImage.result;
                const readerBikeImage = new FileReader();
                readerBikeImage.onloadend = () => {
                    formData.bikeImage = readerBikeImage.result;
                    submitNewRider(formData); // Submit complete data
                };
                readerBikeImage.readAsDataURL(bikeImageFile);
            };
            readerRiderImage.readAsDataURL(riderImageFile);
        });
    }

    /**
     * Submits new rider data to the backend.
     * @param {object} data The rider data to submit.
     */
    async function submitNewRider(data) {
        try {
            const response = await fetch('/add-bike', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to add rider.');
            }
            const result = await response.json();
            alert(result.message || "Rider added successfully!");
            addRiderModalInstance.hide();
            document.getElementById("riderFormModal").reset();
            fetchAndDisplayBikes(); // Refresh the table with the new data
        } catch (error) {
            console.error('Error adding rider:', error);
            alert(`Error saving rider: ${error.message}`);
        }
    }

    // --- Initial Load ---
    fetchAndDisplayBikes();
});