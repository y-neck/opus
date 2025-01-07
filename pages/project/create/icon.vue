<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="flex flex-col items-start">
      <div class="text-left pb-2">
        <h2 class="text-2xl text-grey-700">Choose an icon</h2>
      </div>
      <div>
        <ul class="grid grid-cols-11 gap-3 text-grey-700">
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
      <div v-if="selectedIcon" class="mt-32 absolute transition">
        <button
          @click="saveProject"
          class="flex flex-row items-center justify-center px-3 h-9 rounded-lg bg-grey-100 hover:bg-grey-200 text-grey-700 transition cursor-pointer w-[380px]"
        >
          Create Project
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
import Bean from "@/components/icons/Bean.vue";
import Blossom from "@/components/icons/Blossom.vue";
import Books from "@/components/icons/Books.vue";
import Brush from "@/components/icons/Brush.vue";
import Cmd from "@/components/icons/Cmd.vue";
import ColorPalette from "@/components/icons/ColorPalette.vue";
import Direction from "@/components/icons/Direction.vue";
import Emoji from "@/components/icons/Emoji.vue";
import Ghost from "@/components/icons/Ghost.vue";
import Pencil from "@/components/icons/Pencil.vue";

const route = useRoute();
const projectName = ref(route.query.projectName);

console.log(projectName.value);

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
  { name: "Bean", component: Bean },
  { name: "Blossom", component: Blossom },
  { name: "Books", component: Books },
  { name: "Brush", component: Brush },
  { name: "Cmd", component: Cmd },
  { name: "ColorPalette", component: ColorPalette },
  { name: "Direction", component: Direction },
  { name: "Emoji", component: Emoji },
  { name: "Ghost", component: Ghost },
  { name: "Pencil", component: Pencil },
];

const selectedIcon = ref(null);

// Toggle icon
function toggleIcon(name) {
  selectedIcon.value = selectedIcon.value === name ? null : name;
}

// 
async function saveProject() {
  if (!selectedIcon.value || !user) return;

  const { data: profile, error: profileError } = await supabase
    .from("Profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  console.log(profile);

  // Save project's details
  await supabase
    .from("Projects")
    .insert({
      project_name: projectName.value,
      icon: selectedIcon.value,
      created_by: profile.id,
    });

  const { data: project, error: projectError } = await supabase
    .from("Projects")
    .select("id, created_by")
    .order("id", { ascending: false })
    .eq("created_by", profile.id);

    // Insert the project member
  await supabase.from("Members").insert({
    project_id: project[0].id,
    user_id: profile.id,
    role: 1,
  });

  if (profileError || projectError) {
    console.error("Failed to save icon:", error.message);
  } else {
    navigateTo("/task-overview");
  }
}

definePageMeta({
  layout: false,
  middleware: "auth",
});

useSeoMeta({
  title: "Opus · Create Project",
  ogTitle: "Create Project",
  ogSiteName: "opus",
  ogType: "website",
  description:
    "Welcome to Opus – your project management solution for team projects!",
  ogDescription:
    "Welcome to Opus – your project management solution for team projects!",
  creator: "https://github.com/y-neck/ | https://github.com/kevinschaerer/",
  robots: "noindex, nofollow",
  ogImage: "",
});
</script>
