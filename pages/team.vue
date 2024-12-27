<template>
  <div class="flex flex-col w-full">
    <Header :pageTitle="'Team'" :pageIcon="'PeopleIcon'">
      <template #actions>
        <div class="flex flex-row gap-3">
          <button class="flex flex-row">
            <span class="mt-1 mr-1"><AddPeopleIcon /></span>
            Invite Member
          </button>
        </div>
      </template>
    </Header>
    <main class="p-16">
      <h2 class="text-2xl mb-1.5">Members</h2>
      <hr class="border-grey-100" />
      <div>
        <div v-for="member in teamMembers" :key="member.id">
          <div
            class="flex items-center justify-between p-3 group transition-all"
          >
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
                <span v-else class="text-base text-grey-500">
                  {{ member.name?.charAt(0) }}{{ member.surname?.charAt(0) }}
                </span>
              </div>
              <div>
                <h3>
                  {{
                    isCurrentUser(member.id)
                      ? "You"
                      : `${member.name} ${member.surname}`
                  }}
                </h3>
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
                class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 text-grey-500 active:text-destructive-red transition"
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
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useProjectStore } from "~/middleware/projectStore";
import { supabaseConnection } from "~/composables/supabaseConnection";
import Header from "~/components/Header.vue";
import PencilIcon from "~/components/icons/PencilIcon.vue";

const teamMembers = ref([]);
const projectStore = useProjectStore();
const currentUser = ref(null);

const project = computed(() => {
  return projectStore.activeProjectId;
});

async function getCurrentUser() {
  try {
    const {
      data: { user },
    } = await supabaseConnection().supabase.auth.getUser();
    currentUser.value = user;
    console.log("Current user:", user);
  } catch (error) {
    console.error("Error getting current user:", error);
  }
}

function isCurrentUser(memberId) {
  return currentUser.value?.id === memberId;
}

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
      }
    }
  } catch (error) {
    console.error("Error in fetchTeamMembers:", error);
  }
}

onMounted(async () => {
  await getCurrentUser();
  await fetchTeamMembers();

  watchEffect(async () => {
    if (project.value) {
      await fetchTeamMembers();
    }
  });
});
</script>
