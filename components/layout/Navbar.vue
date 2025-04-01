<template>
  <div class="mr-[252px]">
    <div class="md:h-screen md:border-r border-grey-100 flex flex-col fixed">
      <nav
        class="md:w-[252px] flex md:flex-col max-sm:w-screen max-sm:fixed max-sm:border-t-2 max-md:justify-center"
      >
        <div
          class="bg-white text-grey-700 md:h-[3.75rem] border-b -ml-7 border-grey-100 flex flex-row justify-between md:justify-start align-center"
        >
          <div
            id="project-dropdown"
            class="md:w-[280px] md:px-7 flex items-center"
          >
            <ProjectSwitch />
          </div>
        </div>
        <div id="main-nav" class="hidden md:flex flex-col mt-4">
          <div
            class="flex justify-between cursor-default"
            @mouseover="showLabelInbox = true"
            @mouseleave="showLabelInbox = false"
          >
            <div class="flex flex-row items-center">
              <InboxIcon />
              <p class="nav-item-text">Inbox</p>
            </div>
            <Label v-show="showLabelInbox"></Label>
          </div>
          <NuxtLink to="/task-overview" class="nav-item hover:text-grey-900">
            <NotepadIcon />
            <p class="nav-item-text">Task Overview</p></NuxtLink
          >
          <NuxtLink to="/settings" class="nav-item hover:text-grey-900">
            <SettingsIcon />
            <p class="nav-item-text">Settings</p></NuxtLink
          >
        </div>
        <div>
          <div
            id="team-name"
            class="hidden md:block text-grey-500 text-sm mt-8"
          >
            <p v-if="activeProjectName">{{ activeProjectName }}</p>
            <span v-else><ActiveProjectSkeleton /></span>
          </div>
        </div>
        <div
          id="team-nav"
          class="flex md:flex-col justify-between max-sm:gap-8 mt-1"
        >
          <NuxtLink to="/tasks" class="nav-item hover:text-grey-900">
            <NoteIcon />
            <p class="nav-item-text">Tasks</p></NuxtLink
          >
          <div
            class="flex justify-between cursor-default"
            @mouseover="showLabelTimeline = true"
            @mouseleave="showLabelTimeline = false"
          >
            <div class="flex flex-row items-center">
              <TimelineIcon />
              <p class="nav-item-text">Timeline</p>
            </div>
            <Label v-show="showLabelTimeline"></Label>
          </div>
          <NuxtLink to="/documents" class="nav-item hover:text-grey-900">
            <FilesIcon />
            <p class="nav-item-text">Documents</p></NuxtLink
          >
          <div
            class="flex justify-between cursor-default"
            @mouseover="showLabelChat = true"
            @mouseleave="showLabelChat = false"
          >
            <div class="flex flex-row items-center">
              <BubbleIcon />
              <p class="nav-item-text">Chat</p>
            </div>
            <Label v-show="showLabelChat"></Label>
          </div>
          <NuxtLink to="/team" class="nav-item hover:text-grey-900">
            <PeopleIcon />
            <p class="nav-item-text">Team</p></NuxtLink
          >
        </div>

        <div class="absolute bottom-5">
          <button
            id="logout-btn"
            class="nav-item group transition"
            @click="logout()"
          >
            <LogoutIcon class="group-hover:text-grey-800" />
            <p class="nav-item-text hidden md:block group-hover:text-grey-900">
              Logout
            </p>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
// Supabase Connection
const { supabase } = useSupabaseConnection();
import { ref } from "vue";

// References
const showLabelInbox = ref(false);
const showLabelTimeline = ref(false);
const showLabelChat = ref(false);

/* Display current project */
import { useProjectStore } from "~/middleware/store/project"; // Import pinia store
import ActiveProjectSkeleton from "~/components/skeletons/ActiveProjectSkeleton.vue";
import ProjectSwitch from "./ProjectSwitch.vue";
import Label from "~/components/common/Label.vue";

// Initialize pinia store
const projectStore = useProjectStore();
// Update team name reactively
const activeProjectName = computed(() => projectStore.activeProjectName);

// Logout function
async function logout() {
  await supabase.auth.signOut();
  navigateTo("/login");
}
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
}

.nav-item.router-link-active {
  background: #f4f4f5;
  border-radius: 0.5rem;
  padding-left: 0.75rem;
  margin-left: -0.75rem;
  max-width: 15.5rem;
  height: 2rem;
}

.router-link-active:hover {
  color: #3f3f46;
}

.nav-item-text {
  line-height: 32px;
  padding-inline: 8px;
}

@media (max-width: 640px) {
  .nav-item-text {
    display: none;
  }
}
</style>
