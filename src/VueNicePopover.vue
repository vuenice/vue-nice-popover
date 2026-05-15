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
          :style="{ ...floatingStyles }"
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
  onOpen: {
    type: Function,
    default: null
  }
});

const triggerRef = ref(null);
const panelRef = ref(null);

const { floatingStyles } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-end',
  middleware: [
    offset(4),
    flip({
      fallbackStrategy: 'bestFit'
    }),
    shift({ padding: 8 })
  ]
});

function onPanelClick(event, close) {
  if (!props.autoClose) return;
  close();
}

const handleButtonClick = (isCurrentlyOpen) => {
  if (!isCurrentlyOpen && props.onOpen) {
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