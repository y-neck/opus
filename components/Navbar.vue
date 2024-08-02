<template>
  <div>
    <nav class="w-[280px] flex flex-col gap-8 border-r-1 border-grey-100">
      <div id="main-nav" class="flex flex-col">
        <NuxtLink to="/inbox" class="navbar-item">
          <img src="" alt="icn" />
          <p>Inbox</p></NuxtLink
        >
        <NuxtLink to="/task-overview" class="navbar-item">
          <img src="" alt="icn" />
          <p>Task Overview</p></NuxtLink
        >
        <NuxtLink to="/settings" class="navbar-item">
          <img src="" alt="icn" />
          <p>Settings</p></NuxtLink
        >
      </div>
      <div id="team-nav" class="flex flex-col">
        <NuxtLink to="/tasks" class="navbar-item">
          <img src="" alt="icn" />
          <p>Tasks</p></NuxtLink
        >
        <NuxtLink to="/timeline" class="navbar-item">
          <img src="" alt="icn" />
          <p>Timeline</p></NuxtLink
        >
        <NuxtLink to="/documents" class="navbar-item">
          <img src="" alt="icn" />
          <p>Documents</p></NuxtLink
        >
        <NuxtLink to="/chat" class="navbar-item">
          <img src="" alt="icn" />
          <p>Chat</p></NuxtLink
        >
        <NuxtLink to="/team" class="navbar-item">
          <img src="" alt="icn" />
          <p>Team</p></NuxtLink
        >
      </div>
    </nav>
  </div>
</template>

<script setup></script>

<style scoped>
.navbar-item {
  display: flex;
  align-items: center;
}

p {
  line-height: 32px;
  padding-inline: 8px;
}
</style>
