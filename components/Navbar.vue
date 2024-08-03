<template>
  <div>
    <nav
      class="md:w-[266px] md:h-screen flex md:flex-col gap-8 md:border-r-2 border-grey-100 max-sm:w-screen max-sm:fixed max-sm:top-[95vh] max-sm:border-t-2"
    >
      <div id="main-nav" class="hidden md:flex flex-col">
        <NuxtLink to="/inbox" class="nav-item">
          <img src="" alt="icn" />
          <p class="nav-item-text">Inbox</p></NuxtLink
        >
        <NuxtLink to="/task-overview" class="nav-item">
          <img src="" alt="icn" />
          <p class="nav-item-text">Task Overview</p></NuxtLink
        >
        <NuxtLink to="/settings" class="nav-item">
          <img src="" alt="icn" />
          <p class="nav-item-text">Settings</p></NuxtLink
        >
      </div>
      <div id="team-nav" class="flex md:flex-col justify-between max-sm:gap-8">
        <p id="team-name" class="hidden md:block text-grey-500 text-sm">
          [Team Name]
        </p>
        <NuxtLink to="/tasks" class="nav-item">
          <img src="" alt="icn" />
          <p class="nav-item-text">Tasks</p></NuxtLink
        >
        <NuxtLink to="/timeline" class="nav-item">
          <img src="" alt="icn" />
          <p class="nav-item-text">Timeline</p></NuxtLink
        >
        <NuxtLink to="/documents" class="nav-item">
          <img src="" alt="icn" />
          <p class="nav-item-text">Documents</p></NuxtLink
        >
        <NuxtLink to="/chat" class="nav-item">
          <img src="" alt="icn" />
          <p class="nav-item-text">Chat</p></NuxtLink
        >
        <NuxtLink to="/team" class="nav-item">
          <img src="" alt="icn" />
          <p class="nav-item-text">Team</p></NuxtLink
        >
      </div>
    </nav>
  </div>
</template>

<script setup></script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
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
