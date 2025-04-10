<template>
  <div class="flex flex-col w-full">
    <Header :pageTitle="'Documents'" :pageIcon="'FilesIcon'">
      <template #actions>
        <div class="flex flex-row gap-3">
          <button @click="openModal" class="flex flex-row">
            <span class="mt-1 mr-1"><PlusIcon /></span>
            Add Link
          </button>
        </div>
      </template>
    </Header>
    <main class="p-16">
      <div>
        <h2 class="text-2xl mb-1.5">Documents</h2>
        <div v-if="isLoading">
          <DocumentsSkeleton />
          <DocumentsSkeleton />
        </div>
        <div v-if="Object.keys(groupedLinks).length">
          <div
            v-for="(linksGroup, date) in groupedLinks"
            :key="date"
            class="my-4 mb-9"
          >
            <h3 class="text-sm text-grey-500 tracking-[0.01em]">{{ date }}</h3>
            <hr class="text-grey-100 mt-2" />
            <ul>
              <li v-for="(link, index) in linksGroup" :key="link.id">
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
                        class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 text-grey-500 transition"
                      >
                        <CopyIcon />
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
      <Modal
        v-if="isDeleteModalOpen"
        :isOpen="isDeleteModalOpen"
        title="Remove Document"
        message="Are you sure you want to remove this document?"
        @confirm="deleteDocument"
        @cancel="isDeleteModalOpen = false"
      />
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
const { supabase } = useSupabaseConnection();
import { ref, watchEffect } from "vue";
import { useProjectStore } from "~/middleware/store/project";
import Header from "~/components/layout/Header.vue";
import Modal from "~/components/project/RemoveModal.vue";
import DocumentsModal from "~/components/project/documents/DocumentsModal.vue";
import DocumentsSkeleton from "~/components/skeletons/DocumentsSkeleton.vue";
import { format } from "date-fns";

const projectStore = useProjectStore();

// References
const links = ref([]);
const groupedLinks = ref({});
const isLoading = ref(true);
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const documentToDelete = ref(null);

// Format link to remove www.
function formatLink(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace("www.", "");
  } catch (error) {
    console.error("Invalid URL:", url);
    return url;
  }
}

// Fetch favicon of hosting platform
function getFaviconUrl(url, size = 64) {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${hostname}`;
  } catch (error) {
    console.error("Invalid URL:", url);
    return "";
  }
}

// Group links by date
function groupLinksByDate(data) {
  const grouped = {};
  data.forEach((link) => {
    const date = format(new Date(link.created_at), "EEEE, dd MMM yyyy");
    grouped[date] = grouped[date] || [];
    grouped[date].push(link);
  });
  return grouped;
}

// Fetch all links
async function getLinks() {
  try {
    const { data, error } = await supabase
      .from("Links")
      .select("*")
      .eq("project_id", projectStore.activeProjectId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (data) {
      links.value = data;
      groupedLinks.value = groupLinksByDate(data);
    }
  } catch (error) {
    console.error("Error fetching links:", error);
  } finally {
    isLoading.value = false;
  }
}

// Copy link
function copyDocument(link) {
  navigator.clipboard.writeText(link);
}

function showDeleteModal(link) {
  documentToDelete.value = link;
  isDeleteModalOpen.value = true;
}

// Delete link from database
async function deleteDocument() {
  try {
    const { error } = await supabase
      .from("Links")
      .delete()
      .eq("id", documentToDelete.value.id);
    if (error) throw error;
    await getLinks();
    isDeleteModalOpen.value = false;
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

function handleConfirm() {
  isModalOpen.value = false;
  getLinks();
}

watchEffect(() => {
  if (projectStore.activeProjectId) {
    getLinks();
  }
});

function openModal() {
  isModalOpen.value = true;
}

definePageMeta({
  middleware: "auth",
  layout: "default",
});

useSeoMeta({
  title: "Opus · Documents",
  ogTitle: "Documents",
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
