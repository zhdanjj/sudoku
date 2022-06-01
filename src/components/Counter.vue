<template>
  <div class="Counter">
    {{ formatted }}
  </div>
</template>

<script>
export default {
  name: 'Counter',
  data: () => ({
    value: 0,
    timer: null,
  }),
  computed: {
    formatted () {
      const v = this.value
      const m = String(Math.floor(v / 60)).padStart(2, '0')
      const s = String(v % 60).padStart(2, '0')
      return `${m}:${s}`
    },
  },
  mounted () {
    this.timer = setInterval(() => {
      this.value += 1
    }, 1e3)
  }
}
</script>