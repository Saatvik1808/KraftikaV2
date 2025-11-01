export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-6 lg:py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5 animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded flex-1 animate-pulse" />
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-12 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

