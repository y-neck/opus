<template>
  <div class="flex flex-col w-full">
    <Header :pageTitle="'Team'" :pageIcon="'PeopleIcon'">
      <template #actions>
        <div class="flex flex-row gap-3">
          <button class="flex flex-row" @click="showInviteModal">
            <span class="mt-1 mr-1"><AddPeopleIcon /></span>
            Invite Member
          </button>
        </div>
      </template>
    </Header>
    <main class="p-16">
      <h2 class="text-2xl mb-1.5">Members</h2>
      <hr class="border-grey-100" />
      <!-- Skeleton before page is fully loaded -->
      <div v-if="isLoading">
        <MemberSkeleton />
        <hr class="border-grey-100" />
        <MemberSkeleton />
        <hr class="border-grey-100" />
        <MemberSkeleton />
        <hr class="border-grey-100" />
        <MemberSkeleton />
        <hr class="border-grey-100" />
      </div>
      <div>
        <div v-for="member in teamMembers" :key="member.id">
          <div class="flex justify-between py-3 group transition-all">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-grey-100"
              >
                <img
                  v-if="member.profile_img"
                  :src="member.profile_img"
                  :alt="`${member.name} ${member.surname}`"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3>{{ member.name }} {{ member.surname }}</h3>
                <p class="text-base font-normal text-grey-500">
                  {{ getRoleName(member.role) }}
                </p>
              </div>
            </div>
            <div
              class="flex flex-row opacity-0 gap-1 mt-1 group-hover:opacity-100 transition"
            >
              <span
                class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 text-grey-500 active:text-grey-950 transition"
              >
                <PencilIcon />
              </span>
              <span
                @click="showDeleteModal(link)"
                class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 text-grey-500 hover:text-destructive-red transition"
              >
                <RemovePeopleIcon />
              </span>
            </div>
          </div>
          <hr class="border-grey-100" />
        </div>
      </div>
    </main>
  </div>
  <!-- Invite Member Modal -->
  <InviteMemberModal
    v-if="isInviteModalOpen"
    :projectId="project"
    @close="closeInviteModal"
  />
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useProjectStore } from "~/middleware/projectStore";
import { supabaseConnection } from "~/composables/supabaseConnection";
import Header from "~/components/Header.vue";
import MemberSkeleton from "~/components/Skeleton/MemberSkeleton.vue";
import InviteMemberModal from "~/components/Modals/InviteMemberModal.vue";
import PencilIcon from "~/components/icons/PencilIcon.vue";

const teamMembers = ref([]);
const projectStore = useProjectStore();
const isInviteModalOpen = ref(false);
const isLoading = ref(true);

// Handle Modal
const showInviteModal = () => {
  isInviteModalOpen.value = true;
};

const closeInviteModal = () => {
  isInviteModalOpen.value = false;
};

const project = computed(() => {
  return projectStore.activeProjectId;
});

function getRoleName(roleId) {
  const roles = {
    1: "Owner",
    2: "Admin",
    3: "Member",
  };
  return roles[roleId] || "Member";
}

async function fetchTeamMembers() {
  try {
    if (project.value) {
      const { data: membersData, error: membersError } =
        await supabaseConnection()
          .supabase.from("Members")
          .select("*")
          .eq("project_id", project.value);

      if (membersError) {
        console.error("Members error:", membersError);
        return;
      }

      if (membersData && membersData.length > 0) {
        const userIds = membersData.map((member) => member.user_id);

        const { data: profilesData, error: profilesError } =
          await supabaseConnection()
            .supabase.from("Profiles")
            .select("id, name, surname, email, profile_img")
            .in("id", userIds);

        if (profilesError) {
          console.error("Profiles error:", profilesError);
          return;
        }

        teamMembers.value = membersData.map((member) => {
          const profile = profilesData?.find((p) => p.id === member.user_id);
          return {
            id: member.user_id,
            name: profile?.name || "No name found",
            surname: profile?.surname || "No surname found",
            email: profile?.email || "No email found",
            profile_img: profile?.profile_img || null,
            role: member.role,
          };
        });
        isLoading.value = false;
      }
    }
  } catch (error) {
    console.error("Error in fetchTeamMembers:", error);
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchTeamMembers();

  watchEffect(async () => {
    if (project.value) {
      await fetchTeamMembers();
    }
  });
});
</script>
