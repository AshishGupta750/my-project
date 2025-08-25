document.addEventListener('DOMContentLoaded', () => {
            const categoryFilter = document.getElementById('category-filter');
            const productItems = document.querySelectorAll('.product-item');

            categoryFilter.addEventListener('change', (event) => {
                const selectedCategory = event.target.value;

                productItems.forEach(item => {
                    // Check if the item's category matches the selected category or if 'all' is selected
                    const itemCategory = item.getAttribute('data-category');
                    if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                        item.style.display = 'block'; // Show the item
                    } else {
                        item.style.display = 'none'; // Hide the item
                    }
                });
            });
        });