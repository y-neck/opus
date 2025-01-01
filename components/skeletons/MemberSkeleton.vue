<template>
  <div
    role="status"
    class="flex items-center gap-3 max-w-sm animate-pulse h-[4.5rem]"
  >
    <div>
      <div class="w-10 h-10 rounded-full bg-grey-200"></div>
    </div>
    <div>
      <div class="h-2.5 bg-grey-200 rounded-full w-44 mb-3 mt-1"></div>
      <div class="h-2 bg-grey-200 rounded-full w-24"></div>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<!-- For reference: https://flowbite.com/docs/components/skeleton/ -->
