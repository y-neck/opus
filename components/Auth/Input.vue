
import type { Title } from '#build/components';
<template>
    <label class="text-sm text-grey-500 mb-1" :for="type"> {{ label }} </label>
    <input class=" w-[20rem] h-10 border text-grey-700 border-grey-100 rounded-lg pl-3 placeholder-grey-400 pr-2 mb-2
        focus:outline-none focus:border-grey-200" :type="type" :placeholder="placeholder" :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)" :pattern="pattern" required />
</template>

<script setup>
defineProps({
    label: String,
    type: String,
    placeholder: String,
    pattern: String,
    modelValue: String,

})
</script>
