/**
 * Google Analytics Event Tracking Utility
 * Tracks user interactions and e-commerce events
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date | { [key: string]: any },
      config?: { [key: string]: any }
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: {
    [key: string]: any;
  }
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...eventParams,
      event_category: eventParams?.event_category || 'engagement',
    });
  }
}

/**
 * Track product view
 */
export function trackProductView(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'INR',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || 'Candles',
          price: product.price,
          currency: 'INR',
        },
      ],
    });
  }
}

/**
 * Track add to cart
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'INR',
      value: product.price * (product.quantity || 1),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || 'Candles',
          price: product.price,
          quantity: product.quantity || 1,
          currency: 'INR',
        },
      ],
    });
  }
}

/**
 * Track remove from cart
 */
export function trackRemoveFromCart(product: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'remove_from_cart', {
      currency: 'INR',
      value: product.price * (product.quantity || 1),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
          currency: 'INR',
        },
      ],
    });
  }
}

/**
 * Track begin checkout
 */
export function trackBeginCheckout(items: Array<{
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}>, totalValue: number): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: totalValue,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || 'Candles',
        price: item.price,
        quantity: item.quantity,
        currency: 'INR',
      })),
    });
  }
}

/**
 * Track purchase
 */
export function trackPurchase(
  transactionId: string,
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>,
  totalValue: number,
  tax?: number,
  shipping?: number
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      currency: 'INR',
      value: totalValue,
      tax: tax || 0,
      shipping: shipping || 0,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || 'Candles',
        price: item.price,
        quantity: item.quantity,
        currency: 'INR',
      })),
    });
  }
}

/**
 * Track product click
 */
export function trackProductClick(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  listName?: string;
}): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'select_item', {
      currency: 'INR',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || 'Candles',
          item_list_name: product.listName || 'Product List',
          price: product.price,
          currency: 'INR',
        },
      ],
    });
  }
}

/**
 * Track category filter
 */
export function trackCategoryFilter(category: string): void {
  trackEvent('filter_by_category', {
    event_category: 'filter',
    category: category,
  });
}

/**
 * Track sort selection
 */
export function trackSortSelection(sortBy: string): void {
  trackEvent('sort_products', {
    event_category: 'filter',
    sort_by: sortBy,
  });
}

/**
 * Track price range filter
 */
export function trackPriceRangeFilter(range: string): void {
  trackEvent('filter_by_price', {
    event_category: 'filter',
    price_range: range,
  });
}

/**
 * Track wishlist add
 */
export function trackWishlistAdd(product: {
  id: string;
  name: string;
  price: number;
}): void {
  trackEvent('add_to_wishlist', {
    event_category: 'engagement',
    item_id: product.id,
    item_name: product.name,
    value: product.price,
    currency: 'INR',
  });
}

/**
 * Track wishlist remove
 */
export function trackWishlistRemove(product: {
  id: string;
  name: string;
}): void {
  trackEvent('remove_from_wishlist', {
    event_category: 'engagement',
    item_id: product.id,
    item_name: product.name,
  });
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string, resultsCount?: number): void {
  trackEvent('search', {
    event_category: 'search',
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, formLocation?: string): void {
  trackEvent('form_submit', {
    event_category: 'engagement',
    form_name: formName,
    form_location: formLocation,
  });
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string, buttonLocation?: string): void {
  trackEvent('button_click', {
    event_category: 'engagement',
    button_name: buttonName,
    button_location: buttonLocation,
  });
}

/**
 * Track page view
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-2PE2MFNQ1L', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}

/**
 * Track share
 */
export function trackShare(method: string, contentType: string, itemId?: string, itemName?: string): void {
  trackEvent('share', {
    event_category: 'engagement',
    method: method,
    content_type: contentType,
    item_id: itemId,
    item_name: itemName,
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: number): void {
  trackEvent('scroll', {
    event_category: 'engagement',
    scroll_depth: depth,
  });
}

/**
 * Track time on page
 */
export function trackTimeOnPage(timeInSeconds: number, pagePath: string): void {
  trackEvent('time_on_page', {
    event_category: 'engagement',
    time_seconds: timeInSeconds,
    page_path: pagePath,
  });
}

