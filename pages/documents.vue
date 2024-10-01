<!-- Documents -->
<template>
  <div class="flex flex-col w-full">
    <Header :pageTitle="'Documents'" :pageIcon="'FilesIcon'">
      <template #actions>
        <div class="flex flex-row gap-3">
          <button class="flex flex-row">
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
        <div v-if="Object.keys(groupedLinks).length">
          <div
            class="my-4 mb-9"
            v-for="(linksGroup, date) in groupedLinks"
            :key="date"
          >
            <h3 class="font-normal text-sm text-grey-500 tracking-[0.01em]">
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
                        class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 text-grey-500 active:text-destructive-red transition"
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
        <!-- TODO: Rework text if no documents in DB -->
        <p v-else>No documents found</p>
      </div>
    </main>

    <!-- Modals -->
    <Modal
      v-if="isDeleteModalOpen"
      :isOpen="isDeleteModalOpen"
      title="Remove Document"
      message="Are you sure you want to remove this document?"
      @confirm="deleteDocument"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
import Modal from '~/components/Modals/RemoveModal.vue';
import { ref } from 'vue';
import { format } from 'date-fns';
import CopyIcon from '~/components/icons/CopyIcon.vue';
import TrashCanIcon from '~/components/icons/TrashCanIcon.vue';

// Supabase
const supabase = useSupabaseClient();
const user = useSupabaseUser();

console.log(user.value);

const links = ref([]);
const groupedLinks = ref({});

// Function to format the link by removing protocol and path
function formatLink(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', ''); // Remove 'www.' if present
  } catch (error) {
    console.error('Invalid URL:', url);
    return url; // Return the original URL if it can't be parsed
  }
}

// Function to generate favicon URL
function getFaviconUrl(url, size = 64) {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${hostname}`;
  } catch (error) {
    console.error('Invalid URL:', url);
    return '';
  }
}

// Function to group links by their created_at date
function groupLinksByDate(data) {
  const grouped = {};
  data.forEach((link) => {
    const date = format(link.created_at, 'EEEE, dd MMM yyyy');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(link);
  });
  return grouped;
}

async function getLinks() {
  try {
    const { data, error, status } = await supabase
      .from('Links')
      .select('id, link, description, created_at')
      .order('created_at', { ascending: false });

    if (error && status !== 406) throw error;

    if (data) {
      links.value = data;
      groupedLinks.value = groupLinksByDate(data);
    }
  } catch (error) {
    console.error(error.message);
  }
}

getLinks();

// Function to copy the document link to clipboard
function copyDocument(link) {
  navigator.clipboard.writeText(link);
}

const isDeleteModalOpen = ref(false);
const documentToDelete = ref(null);

function showDeleteModal(link) {
  documentToDelete.value = link;
  isDeleteModalOpen.value = true;
}

async function deleteDocument() {
  try {
    console.log('Deleting document:', documentToDelete.value.id);
    // Delete document from the database using its ID
    const { error, status } = await supabase
      .from('Links')
      .delete()
      .eq('id', documentToDelete.value.id);

    if (error && status !== 406) throw error;

    // After successful deletion, fetch the updated links list
    const { data: updatedLinks, error: fetchError } = await supabase
      .from('Links')
      .select('link, description, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    // Update your links and grouped links state after deletion
    if (updatedLinks) {
      links.value = updatedLinks;
      groupedLinks.value = groupLinksByDate(updatedLinks);
    }

    console.log('Deleting document:', documentToDelete.value);
    console.log('Links after deletion:', links.value);

    // Close the modal after deletion
    isDeleteModalOpen.value = false;
  } catch (error) {
    console.error('Error deleting document:', error.message);
  }
}

// Page meta
definePageMeta({
  title: 'Documents',
  description: '',
  middleware: 'auth',
  layout: 'default',
});
</script>
