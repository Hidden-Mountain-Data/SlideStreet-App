<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'
import miscUnderMaintenance from '@images/pages/misc-under-maintenance.png'
import tree3 from '@images/pages/tree-3.png'

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
  <div class="misc-wrapper">
    <div class="text-center mb-4">
      <!-- 👉 Title and subtitle -->
      <h5 class="text-h5 mb-1">
        Under Maintenance! 🚧
      </h5>
      <p class="text-sm">
        Sorry for the inconvenience but we're performing some maintenance at the moment
      </p>
    </div>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="miscUnderMaintenance"
        alt="Coming Soon"
        :max-width="800"
        class="mx-auto"
      />
      <VBtn
        to="/"
        class="mt-10"
      >
        Back to Home
      </VBtn>
    </div>

    <!-- 👉 Footer -->
    <VImg
      :src="tree3"
      class="misc-footer-tree d-none d-md-block"
    />

    <VImg
      :src="authThemeMask"
      class="misc-footer-img d-none d-md-block flip-in-rtl"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";

.misc-footer-tree {
  inline-size: 15.3rem;
  inset-block-end: 3.2rem;
  inset-inline-start: 2rem;
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
