<template>
  <Popover
    v-slot="{ open, close }"
    class="relative"
    :class="props.popoverClass"
  >
    <PopoverButton
      ref="triggerRef"
      :disabled="props.disabled"
      :class="[props.buttonClass, props.disabled ? 'opacity-50 cursor-not-allowed' : 'focus:outline-none h-full']"
      @click="handleButtonClick(open)"
    >
      <slot
        name="popoverButton"
        :open="open"
      />
    </PopoverButton>
    <Teleport to="body">
      <div v-if="open">
        <PopoverPanel
          ref="panelRef"
          static
          class="absolute bg-white rounded-lg shadow-md py-1 border border-gray-200 w-56 pointer-events-auto overflow-y-auto custom-scrollbar-v2 z-50"
          :class="[props.panelClass]"
          :style="{ ...floatingStyles}"
          @click.capture="onPanelClick($event, close)"
        >
          <slot
            name="popoverOptions"
            :close="close"
          />
        </PopoverPanel>
      </div>
    </Teleport>
  </Popover>
</template>

<script setup>
import { detectOverflow, flip, offset, shift, useFloating } from '@floating-ui/vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { ref } from 'vue';

const props = defineProps({
  panelClass: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  popoverClass: { type: String, default: '' },
  buttonClass: { type: String, default: '' },
  autoClose: { type: Boolean, default: false },
  positionBottom: { type: Boolean, default: false },
  onOpen: {
    type: Function,
    default: null
  }
})
const triggerRef = ref(null)
  const panelRef = ref(null)

  
  const { floatingStyles, update } = useFloating(triggerRef, panelRef, {
  placement:  'bottom-end',
  middleware: [
    offset(4),
    flip({
      // Allow all placements but with custom logic
      fallbackStrategy: 'bestFit'
    }),
    // Custom middleware to override flip when both top and bottom have limited space
    {
      name: 'preferBottomWhenLimited',
      async fn(state) {
        const overflow = await detectOverflow(state);
        const { rects, placement } = state;
        
        // Calculate available space
        const spaceBelow = window.innerHeight - state.rects.reference.y - state.rects.reference.height;
        const spaceAbove = state.rects.reference.y;
        
        const popoverHeight = rects.floating.height || 200; // estimated height
        
        // If both spaces are limited (less than popover height + buffer)
        const buffer = 50;
        if (spaceBelow < popoverHeight + buffer && spaceAbove < popoverHeight + buffer) {
          // Force bottom placement
          if (placement.startsWith('top')) {
            return {
              reset: {
                placement: 'bottom-end'
              }
            };
          }
        }
        
        return {};
      }
    },
    shift({ padding: 8 }),
  ],
  // strategy: 'fixed', // Ensures it's not tied to layout flow
});

function onPanelClick(event, close) {
  if (!props.autoClose) return;
    close();
}
const handleButtonClick = (isCurrentlyOpen) => {
  if (!isCurrentlyOpen && props.onOpen) {
    // About to open, call the method
    props.onOpen();
  }
};

</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
