import { ref } from 'vue';

// Initialize the visibility state for dropdowns by referencing tasks by button class
export const isDropdownVisible = ref<{ [key: string]: boolean }>({});

export function toggleDropdown(dropdownId: string) {
  // Close all other dropdowns by iterating through the currently open dropdowns
  Object.keys(isDropdownVisible.value).forEach((key) => {
    // If the dropdown ID is not the one being toggled, set it to false (hide it)
    if (key !== dropdownId) {
      isDropdownVisible.value[key] = false;
    }
  });

  // Toggle the visibility of the current dropdown
  isDropdownVisible.value = {
    ...isDropdownVisible.value, // Spread the current visibility state
    [dropdownId]: !isDropdownVisible.value[dropdownId], // Invert the visibility of the dropdown being toggled
  };
}



