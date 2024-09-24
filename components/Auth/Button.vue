<template>
    <button :disabled="disabled"
        class="w-[20rem] h-10 bg-grey-100 hover:bg-grey-200 text-grey-700 rounded-lg font-regular transition disabled:text-grey-400 disabled:transition disabled:hover:bg-grey-100"
        type="submit">
        {{ title }}
    </button>
</template>

<script setup>
defineProps({
    title: String,
    disabled: Boolean
})
</script>
