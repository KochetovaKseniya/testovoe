$(document).ready(function() {
    let popupOnce = $('.popup').attr('data-show-once');
    
    let popupShown = localStorage.getItem('popupShown');

    function wasPopupShown() {
        return localStorage.getItem('popupShown') === 'true';
    }
    function setPopupShown() {
        localStorage.setItem('popupShown', 'true'); 
    }
    let cartType = $('.popup').data('use-drawer');

    $('.popup__close').on('click', function(event) {
        $('.popup').removeClass('open');
        $('.popup').fadeOut();
        $('body').removeClass('no-scroll');
    });

    $('.popup-open').on('click', function(event) {

        if (popupOnce === 'true' && localStorage.getItem('popupShown') === 'true') {
            console.log('popupShown yes');
        } else {

            event.preventDefault();
        
            $('.popup').fadeIn();
            $('.popup').css('display', 'flex');
            $('body').addClass('no-scroll');

            let variantId = $(this).closest('form').find('.product-variant-id').val();
            let productName = $(this).closest('.card__content').find('.card__heading a').text();
            $('.popup').attr('data-product', variantId);
            $('.popup').attr('data-product-name', productName);

            popupContent();
            localStorage.setItem('popupShown', 'true'); 
        }

    });

    function popupContent() {
        let totalDiscount = 0; 
    
        $('.popup__item').each(function() {
            let priceBeforeSpan = $(this).find('.popup__item--price').contents().filter(function() {
                return this.nodeType === 3;
            }).text().trim();
    
            let priceInSpan = $(this).find('.popup__item--price span').text().trim();
    
            let priceBefore = parseFloat(priceBeforeSpan.replace('$', ''));
            let priceAfter = parseFloat(priceInSpan.replace('$', ''));
    
            if (!isNaN(priceBefore) && !isNaN(priceAfter)) {
                let priceDifference = priceAfter - priceBefore;
                
                totalDiscount += priceDifference; 
            }
        });
    
        if (totalDiscount != 0) {
            $('.popup__text span').text('$' + totalDiscount.toFixed(2) + '!'); 
        } else {
            $('.popup__text').css('display', 'none');
        }
    }
    

    $('.popup__btns--cart').on('click', function(event) {
        event.preventDefault();
        let additionalProducts = [];
        let variantId = $('.popup').attr('data-product');
        if (variantId) {
            additionalProducts.push({
                id: variantId,
                quantity: 1
            });
        } else {
            console.error('Main product variant ID is missing');
        }

        if (additionalProducts.length === 0) {
            console.error('No products to add to cart');
            return;
        }
    
        let formData = {
            items: additionalProducts
        };

        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Product(s) added to cart:', data);
            
            if (data.items.length !== additionalProducts.length) {
                console.error('Mismatch between sent and added products');
            } else {
                console.log('All products added successfully');
            }

            $('.popup').removeClass('open');
            $('.popup').fadeOut();
            $('body').removeClass('no-scroll');

            if (cartType === 'drawer') {
                updateCartDrawer(); 
            } else if (cartType === 'page') {
                window.location.href = '/cart';
            } else if (cartType === 'notification') {
                if (data.items && data.items.length > 0) {
                    let productsHTML = '';
            
                    data.items.forEach(function(item) {
                        let productImage = item.featured_image.url;
                        let productTitle = item.title;
            
                        productsHTML += `
                            <div class="cart-notification-product__item">
                                <div class="cart-notification-product__image">
                                    <img src="${productImage}" alt="${productTitle}" width="70" height="88" />
                                </div>
                                <div class="cart-notification-product__details">
                                    <p class="cart-notification-product__title">${productTitle}</p>
                                </div>
                            </div>
                        `;
                    });
            
                    $('#cart-notification-product').html(productsHTML);
                    $('.cart-notification').addClass('active');
                } 
            }
        })
        .catch(error => {
            console.error('Error adding product(s) to cart:', error);
        });
    });

    $('.popup__btns--add').on('click', function(event) {
        event.preventDefault();
    
        let additionalProducts = [];
        $('.popup__products .popup__item').each(function() {
            let additionalVariantId = $(this).data('product-id');
            if (additionalVariantId) {
                additionalProducts.push({
                    id: additionalVariantId,
                    quantity: 1
                });
            } else {
                console.error('Missing variant ID for product:', $(this).find('.popup__item--name').text());
            }
        });

        let variantId = $('.popup').attr('data-product');
        if (variantId) {
            additionalProducts.push({
                id: variantId,
                quantity: 1
            });
        } else {
            console.error('Main product variant ID is missing');
        }

        if (additionalProducts.length === 0) {
            console.error('No products to add to cart');
            return;
        }
    
        let formData = {
            items: additionalProducts
        };
    
        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Product(s) added to cart:', data);
            
            if (data.items.length !== additionalProducts.length) {
                console.error('Mismatch between sent and added products');
            } else {
                console.log('All products added successfully');
            }


            $('.popup').removeClass('open');
            $('.popup').fadeOut();
            $('body').removeClass('no-scroll');

            if (cartType === 'drawer') {
                updateCartDrawer(); 
            } else if (cartType === 'page') {
                window.location.href = '/cart';
            } else if (cartType === 'notification') {
                if (data.items && data.items.length > 0) {
                    let productsHTML = '';
            
                    data.items.forEach(function(item) {
                        let productImage = item.featured_image.url;
                        let productTitle = item.title;
            
                        productsHTML += `
                            <div class="cart-notification-product__item">
                                <div class="cart-notification-product__image">
                                    <img src="${productImage}" alt="${productTitle}" width="70" height="88" />
                                </div>
                                <div class="cart-notification-product__details">
                                    <p class="cart-notification-product__title">${productTitle}</p>
                                </div>
                            </div>
                        `;
                    });
            
                    $('#cart-notification-product').html(productsHTML);
                    $('.cart-notification').addClass('active');
                } 
            }
        })
        .catch(error => {
            console.error('Error adding products to cart:', error);
        });
    });

    function updateCartDrawer() {
        console.log('Fetching cart section to update drawer');
        
        $.ajax({
            url: '/?section_id=cart-drawer',  
            type: 'GET',
            dataType: 'html',
            success: function(carthtml) {
                $('cart-drawer').html($(carthtml).find('cart-drawer').html());
                console.log('Drawer content updated from section HTML');
                
                if ($('.cart-drawer').length) {
                    $('.drawer').removeClass('is-empty');
                    $('.drawer').addClass('animate');
                    $('.drawer').addClass('active');
                    $('.cart-drawer').addClass('is-open');
                    console.log('Drawer opened with updated content');
                } else {
                    console.error('Drawer element not found');
                }
            },
            error: function(error) {
                console.error('Error fetching cart drawer section:', error);
            }
        });
    }
});
