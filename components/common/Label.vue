<template>
  <Transition
    enter-active-class="transition-all duration-200 delay-500"
    enter-from-class="opacity-0 blur-[2px]"
    enter-to-class="opacity-100 blur-none"
    leave-active-class="transition-all duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      class="flex items-center bg-[#2D60D7] text-grey-50 h-5 px-2 rounded-md text-xs mr-4 mt-[5px]"
    >
      <p class="tracking-wide">Coming Soon</p>
    </div>
  </Transition>
</template>
