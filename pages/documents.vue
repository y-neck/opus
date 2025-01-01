<template>
  <div class="flex flex-col w-full">
    <Header :pageTitle="'Documents'" :pageIcon="'FilesIcon'">
      <template #actions>
        <div class="flex flex-row gap-3">
          <button @click="openModal" class="flex flex-row">
            <span class="mt-1 mr-1"><PlusIcon /></span>
            Add Link
          </button>
          <span class="border-r h-5 border-grey-100 mt-0.5"></span>
          <span
            class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
          >
            <DotsIcon />
          </span>
        </div>
      </template>
    </Header>
    <main class="p-16">
      <div>
        <h2 class="text-2xl mb-1.5">Documents</h2>
        <!-- Skeleton before page is fully loaded -->
        <div v-if="isLoading">
          <DocumentsSkeleton />
          <DocumentsSkeleton />
        </div>
        <div v-if="Object.keys(groupedLinks).length">
          <div
            class="my-4 mb-9"
            v-for="(linksGroup, date) in groupedLinks"
            :key="date"
          >
            <h3 class="text-sm text-grey-500 tracking-[0.01em]">
              {{ date }}
            </h3>
            <hr class="text-grey-100 mt-2" />
            <ul>
              <li v-for="(link, index) in linksGroup" :key="index">
                <div class="flex flex-row my-2">
                  <div class="mr-2 mt-1">
                    <img
                      class="w-4 h-4 rounded"
                      :src="getFaviconUrl(link.link)"
                      alt="favicon"
                    />
                  </div>
                  <div class="flex flex-row w-full justify-between group">
                    <div>
                      <a
                        class="font-medium"
                        :href="link.link"
                        target="_blank"
                        >{{ formatLink(link.link) }}</a
                      >
                      <p class="font-normal text-grey-500">
                        {{ link.description }}
                      </p>
                    </div>
                    <div
                      class="flex flex-row opacity-0 gap-1 mt-1 group-hover:opacity-100 transition"
                    >
                      <span
                        @click="copyDocument(link.link)"
                        class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
                      >
                        <CopyIcon />
                      </span>
                      <span
                        class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 text-grey-500 active:text-grey-950 transition"
                      >
                        <PencilIcon />
                      </span>
                      <span
                        @click="showDeleteModal(link)"
                        class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 text-grey-500 hover:text-destructive-red transition"
                      >
                        <TrashCanIcon />
                      </span>
                    </div>
                  </div>
                </div>
                <hr class="text-grey-100" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Modals -->
      <Modal
        v-if="isDeleteModalOpen"
        :isOpen="isDeleteModalOpen"
        title="Remove Document"
        message="Are you sure you want to remove this document?"
        @confirm="deleteDocument"
        @cancel="isDeleteModalOpen = false"
      />
      <!-- Create new link -->
      <DocumentsModal
        :isOpen="isModalOpen"
        title="Add a new link"
        label="Create"
        @confirm="handleConfirm"
        @cancel="isModalOpen = false"
      />
    </main>
  </div>
</template>

<script setup>
// Supabase Connection
const { supabase } = useSupabaseConnection();

import { ref, watchEffect } from "vue";
import { useProjectStore } from "~/middleware/projectStore";
import Header from "~/components/Header.vue";
import Modal from "~/components/Modals/RemoveModal.vue";
import DocumentsModal from "~/components/Modals/DocumentsModal.vue";
import DocumentsSkeleton from "~/components/Skeleton/DocumentsSkeleton.vue";
import { format } from "date-fns";
import CopyIcon from "~/components/icons/CopyIcon.vue";
import TrashCanIcon from "~/components/icons/TrashCanIcon.vue";
import PencilIcon from "~/components/icons/PencilIcon.vue";
import PlusIcon from "~/components/icons/PlusIcon.vue";
import DotsIcon from "~/components/icons/DotsIcon.vue";

const links = ref([]);
const groupedLinks = ref({});
const projectStore = useProjectStore();
const isDeleteModalOpen = ref(false);
const documentToDelete = ref(null);
const isLoading = ref(true);
const isModalOpen = ref(false);

// Function to format the link by removing protocol and path
function formatLink(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace("www.", ""); // Remove 'www.' if present
  } catch (error) {
    console.error("Invalid URL:", url);
    return url; // Return the original URL if it can't be parsed
  }
}

// Function to generate favicon URL
function getFaviconUrl(url, size = 64) {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${hostname}`;
  } catch (error) {
    console.error("Invalid URL:", url);
    return "";
  }
}

// Function to group links by their created_at date
function groupLinksByDate(data) {
  const grouped = {};
  data.forEach((link) => {
    const date = format(new Date(link.created_at), "EEEE, dd MMM yyyy");
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(link);
  });
  return grouped;
}

async function getLinks() {
  try {
    console.log("Fetching links for project:", projectStore.activeProjectId);

    const { data, error } = await supabase
      .from("Links")
      .select("*")
      .eq("project_id", projectStore.activeProjectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching links:", error);
      return;
    }

    console.log("Fetched links:", data);

    if (data) {
      links.value = data;
      groupedLinks.value = groupLinksByDate(data);
      console.log("Grouped links:", groupedLinks.value);
    }
  } catch (error) {
    console.error("Error in getLinks:", error);
  } finally {
    isLoading.value = false;
  }
}

// Function to copy the document link to clipboard
function copyDocument(link) {
  navigator.clipboard.writeText(link);
}

function showDeleteModal(link) {
  documentToDelete.value = link;
  isDeleteModalOpen.value = true;
}

async function deleteDocument() {
  try {
    if (!documentToDelete.value) return;

    const { error } = await supabase
      .from("Links")
      .delete()
      .eq("id", documentToDelete.value.id);

    if (error) throw error;

    // Refresh the links list
    await getLinks();

    // Close the modal
    isDeleteModalOpen.value = false;
    documentToDelete.value = null;
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

// Watch for project changes and fetch links
watchEffect(() => {
  if (projectStore.activeProjectId) {
    getLinks();
  }
});

// Function to open the modal
function openModal() {
  isModalOpen.value = true;
}

// Page meta
definePageMeta({
  title: "Documents",
  description: "",
  middleware: "auth",
  layout: "default",
});

useSeoMeta({
  title: "Opus - Documents",
  ogTitle: "Documents",
  ogSiteName: "opus",
  ogType: "website",
  description: "Manage the links to the relevant documents of your projects",
  ogDescription: "Manage the links to the relevant documents of your projects",
  creator: "https://github.com/y-neck/ | https://github.com/kevinschaerer/",
  robots: "noindex, nofollow",
  ogImage: "",
});
</script>
