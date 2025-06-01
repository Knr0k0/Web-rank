document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Add Bike Form Handling (in manage_bikes.html) ---
    const addBikeForm = document.getElementById('addBikeForm');
    const addBikeMessage = document.getElementById('addBikeMessage');

    if (addBikeForm) {
        addBikeForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            addBikeMessage.style.display = 'none';
            addBikeMessage.textContent = '';

            const formData = {
                rank: this.rank.value,
                bikerName: this.bikerName.value,
                bikerImage: this.bikerImage.value, // This will be Base64 or URL from textarea
                bikeImage: this.bikeImage.value,   // This will be Base64 or URL from textarea
                bikeBrand: this.bikeBrand.value,
                age: this.age.value,
                keyFeature: this.keyFeature.value,
                overallScore: this.overallScore.value
            };

            try {
                // Đã thay đổi endpoint từ /add-bike thành /add-rankbike
                const response = await fetch('/add-rankbike', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    addBikeMessage.textContent = result.message || 'Xe đạp (rankbike) đã được thêm thành công!';
                    addBikeMessage.style.color = 'green';
                    this.reset(); // Reset form fields
                    // Optionally clear image previews
                    document.getElementById('bikerImagePreview').style.display = 'none';
                    document.getElementById('bikeImagePreview').style.display = 'none';
                    fetchAndDisplayRankBikes(); // Refresh the list of bikes (đổi tên hàm cho nhất quán)
                } else {
                    addBikeMessage.textContent = result.message || 'Lỗi khi thêm xe đạp (rankbike).';
                    addBikeMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                addBikeMessage.textContent = 'Lỗi kết nối hoặc server. Vui lòng thử lại.';
                addBikeMessage.style.color = 'red';
            }
            addBikeMessage.style.display = 'block';
        });
    }

    // --- Image Upload to Base64 and Preview ---
    document.querySelectorAll('.image-upload-trigger').forEach(input => {
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            const targetTextareaId = event.target.dataset.target; // e.g., "bikerImage"
            const targetTextarea = document.getElementById(targetTextareaId);
            const previewImage = document.getElementById(targetTextareaId + 'Preview');

            if (file && targetTextarea && previewImage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    targetTextarea.value = e.target.result; // Set Base64 to textarea
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                };
                reader.readAsDataURL(file); // Read file as Base64
            }
        });
    });


    // --- Fetch and Display RankBikes (in manage_bikes.html) ---
    // Đổi tên bikeListContainer thành rankBikeListContainer và hàm fetchAndDisplayBikes thành fetchAndDisplayRankBikes
    const rankBikeListContainer = document.getElementById('bikeListContainer'); // Giữ ID bikeListContainer từ HTML hoặc đổi cả ở HTML

    async function fetchAndDisplayRankBikes() {
        if (!rankBikeListContainer) return; // Only run if the container exists

        try {
            // Đã thay đổi endpoint từ /api/bikes thành /api/rankbike
            const response = await fetch('/api/rankbike');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rankBikes = await response.json(); // Đổi tên biến cho nhất quán

            if (rankBikes.length === 0) {
                rankBikeListContainer.innerHTML = '<p>Chưa có xe đạp (rankbike) nào được thêm.</p>';
                return;
            }

            let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Hạng</th>
                            <th>Tên VĐV</th>
                            <th>Ảnh VĐV</th>
                            <th>Ảnh Xe</th>
                            <th>Thương Hiệu</th>
                            <th>Tuổi</th>
                            <th>Điểm Tổng</th>
                            <th>Tính Năng</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            rankBikes.forEach(bike => { // Giữ tên biến bike ở đây cho dễ hiểu trong vòng lặp
                tableHTML += `
                    <tr>
                        <td>${bike.rank || 'N/A'}</td>
                        <td>${bike.bikerName || 'N/A'}</td>
                        <td><img src="${bike.bikerImage || 'https://placehold.co/80x80?text=No+Image'}" alt="Ảnh VĐV"></td>
                        <td><img src="${bike.bikeImage || 'https://placehold.co/80x80?text=No+Image'}" alt="Ảnh Xe"></td>
                        <td>${bike.bikeBrand || 'N/A'}</td>
                        <td>${bike.age || 'N/A'}</td>
                        <td>${bike.overallScore || 'N/A'}</td>
                        <td>${bike.keyFeature || 'N/A'}</td>
                    </tr>
                `;
            });
            tableHTML += '</tbody></table>';
            rankBikeListContainer.innerHTML = tableHTML;

        } catch (error) {
            console.error('Error fetching rankbikes:', error);
            rankBikeListContainer.innerHTML = '<p>Lỗi khi tải danh sách xe đạp (rankbike). Vui lòng kiểm tra console.</p>';
        }
    }

    // Initial load of bikes if on the manage_bikes page
    if (window.location.pathname.includes('/admin/manage-bikes')) {
        fetchAndDisplayRankBikes(); // Đổi tên hàm
    }

    // --- Add Product Form Handling (in manage_products.html) ---
    const addProductForm = document.getElementById('addProductForm');
    const addProductMessage = document.getElementById('addProductMessage');

    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            addProductMessage.style.display = 'none';
            addProductMessage.textContent = '';

            const formData = {
                productName: this.productName.value,
                productDescription: this.productDescription.value,
                productPrice: this.productPrice.value,
                productImage: this.productImage.value // Base64 or URL from textarea
            };

            // Đây là ví dụ, bạn cần tạo API endpoint tương ứng trên server (ví dụ: /admin/api/products)
            console.log('Submitting product data (client-side):', formData);
            addProductMessage.textContent = 'Chức năng thêm sản phẩm đang được phát triển (cần API backend). Dữ liệu đã log ở console.';
            addProductMessage.style.color = 'blue';
            addProductMessage.style.display = 'block';
            // try {
            //     const response = await fetch('/admin/api/add-product', { // GIẢ SỬ API ENDPOINT
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(formData)
            //     });
            //     const result = await response.json();
            //     if (response.ok) {
            //         addProductMessage.textContent = result.message || 'Sản phẩm đã được thêm!';
            //         addProductMessage.style.color = 'green';
            //         this.reset();
            //         document.getElementById('productImagePreview').style.display = 'none';
            //         // fetchAndDisplayProducts(); // Hàm tương tự để tải lại danh sách sản phẩm
            //     } else {
            //         addProductMessage.textContent = result.message || 'Lỗi khi thêm sản phẩm.';
            //         addProductMessage.style.color = 'red';
            //     }
            // } catch (error) {
            //     console.error('Error submitting product form:', error);
            //     addProductMessage.textContent = 'Lỗi kết nối hoặc server.';
            //     addProductMessage.style.color = 'red';
            // }
            // addProductMessage.style.display = 'block';
        });
    }

});
