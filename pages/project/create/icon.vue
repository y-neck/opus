<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="flex flex-col items-start">
      <div class="text-left pb-2">
        <h2 class="text-2xl text-grey-700">Choose an icon</h2>
      </div>
      <div>
        <ul class="grid grid-cols-6 gap-3 text-grey-700">
          <li
            v-for="icon in icons"
            :key="icon.name"
            @click="toggleIcon(icon.name)"
            :class="[
              'p-1 rounded cursor-pointer',
              selectedIcon === icon.name ? 'bg-grey-100' : 'hover:bg-grey-100',
            ]"
          >
            <component :is="icon.component" />
          </li>
        </ul>
      </div>
      <div v-if="selectedIcon" class="mt-4">
        <button
          @click="saveProject"
          class="px-4 py-2 bg-grey-400 text-black rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, supabase } = useSupabaseConnection();

import { ref } from "vue";
import { useRoute } from "vue-router";
import ThreeDSphere from "@/components/icons/ThreeDSphere.vue";
import Airdrop from "@/components/icons/Airdrop.vue";
import Airplane from "@/components/icons/Airplane.vue";
import Alien from "@/components/icons/Alien.vue";
import Football from "@/components/icons/Football.vue";
import Analytics from "@/components/icons/Analytics.vue";
import ArScan from "@/components/icons/ArScan.vue";
import Asterisk from "@/components/icons/Asterisk.vue";
import Atom from "@/components/icons/Atom.vue";
import Audio from "@/components/icons/Audio.vue";
import Backpack from "@/components/icons/Backpack.vue";
import Basketball from "@/components/icons/Basketball.vue";

const route = useRoute();
const projectName = ref(route.query.projectName);

console.log(projectName.value);

definePageMeta({
  middleware: "auth",
  layout: false,
});

// Icon data
const icons = [
  { name: "ThreeDSphere", component: ThreeDSphere },
  { name: "Airdrop", component: Airdrop },
  { name: "Airplane", component: Airplane },
  { name: "Alien", component: Alien },
  { name: "Football", component: Football },
  { name: "Analytics", component: Analytics },
  { name: "ArScan", component: ArScan },
  { name: "Asterisk", component: Asterisk },
  { name: "Atom", component: Atom },
  { name: "Audio", component: Audio },
  { name: "Backpack", component: Backpack },
  { name: "Basketball", component: Basketball },
];

const selectedIcon = ref(null);

function toggleIcon(name) {
  selectedIcon.value = selectedIcon.value === name ? null : name;
}

async function saveProject() {
  if (!selectedIcon.value || !user) return;

  const { data: profile, error: profileError } = await supabase
    .from("Profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  console.log(profile);

  await supabase.from("Projects").insert({
    project_name: projectName.value,
    icon: selectedIcon.value,
    created_by: profile.id,
  });

  const { data: project, error: projectError } = await supabase
    .from("Projects")
    .select("id, created_by")
    .order("id", { ascending: false })
    .eq("created_by", profile.id);

  await supabase.from("Members").insert({
    project_id: project[0].id,
    user_id: profile.id,
    role: 1,
  });

  if (profileError || projectError) {
    console.error("Failed to save icon:", error.message);
  } else {
    navigateTo("/inbox");
  }
}
</script>
